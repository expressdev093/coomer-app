import * as cheerio from 'cheerio';
import * as http from 'http';
import * as qs from 'querystring';
import * as URL from 'url';
import * as request from 'request';
import _ from 'lodash';
import {decode} from 'html-entities';

interface VideoDetails {
  title: string;
  duration: number;
  tags: string[];
  thumb: string;
  html: string;
}

interface SearchResult {
  total: number;
  videos: {
    url: string;
    title: string;
    duration: string;
  }[];
}

class PornHub {
  private static videoEmbedUrl = _.template(
    'http://www.pornhub.com/webmasters/video_embed_code?id=<%= video_id  %>',
  );
  private static videoInfoUrl = _.template(
    'http://www.pornhub.com/webmasters/video_by_id?id=<%= video_id  %>&thumbsize=<%= size  %>',
  );

  static resolveId(
    id: number,
    cb: (err: Error | null, location?: string) => void,
  ): void {
    if (typeof id !== 'number') {
      return cb(
        new Error('wrong type for id; expected number but got ' + typeof id),
      );
    }

    const getInfoUrl = PornHub.videoInfoUrl({video_id: id, size: 'large_hd'});

    const req = http.get(getInfoUrl, res => {
      if (res.statusCode === 404) {
        return cb(new Error('video not found'));
      }

      if (res.statusCode !== 301) {
        return cb(
          new Error(
            'incorrect status code; expected 301 but got ' + res.statusCode,
          ),
        );
      }

      return cb(null, res.headers.location);
    });

    req.once('error', cb);
  }

  static details(
    url: string,
    cb: (err: Error | null, details?: VideoDetails) => void,
  ): void {
    const urlParsed = URL.parse(url, true);
    const videoId = urlParsed.query.viewkey as string;
    const urlOpts = {
      video_id: videoId,
      size: 'large_hd',
    };

    const getInfoUrl = PornHub.videoInfoUrl(urlOpts);
    const getEmbedUrl = PornHub.videoEmbedUrl(urlOpts);

    request.get(getInfoUrl, (err, res, body) => {
      if (err) {
        return cb(err);
      }

      if (res.statusCode === 404) {
        return cb(new Error('pornhub: video not found'));
      }

      if (res.statusCode !== 200) {
        return cb(
          new Error(
            'pornhub: incorrect status code; expected 200 but got ' +
              res.statusCode,
          ),
        );
      }

      const data = typeof body === 'string' ? JSON.parse(body) : body;

      const title = data.video.title;
      const duration = data.video.duration;
      const tags = data.video.tags.map(
        (tag: {tag_name: string}) => tag.tag_name,
      );
      const thumb = data.video.default_thumb;

      request.get(getEmbedUrl, (err, res, body) => {
        const embedData = typeof body === 'string' ? JSON.parse(body) : body;
        const html =
          embedData.embed && embedData.embed.code
            ? decode(embedData.embed.code)
            : '';

        return cb(null, {
          title,
          duration,
          tags,
          thumb,
          html,
        });
      });
    });
  }

  static constructSearchUrl(parameters: Record<string, string>): string {
    return (
      'http://www.pornhub.com/webmasters/search?' + qs.stringify(parameters)
    );
  }

  static search(
    parameters: Record<string, string>,
    cb: (err: Error | null, result?: SearchResult) => void,
  ): void {
    const req = http.get(this.constructSearchUrl(parameters), res => {
      let body = Buffer.from('');

      res.on('readable', () => {
        let chunk;
        while ((chunk = res.read())) {
          body = Buffer.concat([body, chunk]);
        }
      });

      if (res.statusCode !== 200) {
        return cb(
          new Error(
            'incorrect status code; expected 200 but got ' + res.statusCode,
          ),
        );
      }

      res.on('end', () => {
        const bodyStr = body.toString('utf8');
        const $ = cheerio.load(bodyStr);

        const videos = $('.thumbBlock > .thumbInside')
          .map((i, e) => {
            let find: cheerio;

            if ($(e).find('script').length) {
              find = cheerio.load(
                $(e)
                  .find('script')
                  .text()
                  .replace(/^thumbcastDisplayRandomThumb\('(.+?)'\);$/, '$1'),
              );
            } else {
              find = $(e).find.bind($(e));
            }

            return {
              url: URL.resolve(
                'http://www.PornHub.com/',
                find('div.thumb > a').attr('href')!.replace('/THUMBNUM/', '/'),
              ),
              title: find('p > a').text(),
              duration: $(e)
                .find('span.duration')
                .text()
                .replace(/[\(\)]/g, '')
                .trim(),
            };
          })
          .get();

        const total = parseInt(
          $('h3.blackTitle')
            .text()
            .replace(/[\r\n]/g, ' ')
            .replace(/^.*- (\d+) results.*$/, '$1'),
          10,
        );

        return cb(null, {total, videos});
      });
    });

    req.once('error', cb);
  }
}

export default PornHub;
