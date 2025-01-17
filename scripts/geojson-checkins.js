import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync(path.resolve('./data/checkins.json')));

function tzDate(d, offset) {
  // date object, timezone offset in minutes
  var offsetLocal = d.getTimezoneOffset();
  var diff = (offset - offsetLocal) * 60000;
  return new Date(+d + diff);
}

const geojson = {
  type: 'FeatureCollection',
  features: data.map(
    ({ id, name, lng, lat, country, cc, createdAt, timeZoneOffset, shout }) => {
      const _datetime = tzDate(new Date(createdAt * 1000), -timeZoneOffset);
      const year = '' + _datetime.getFullYear();
      const month = ('' + (_datetime.getMonth() + 1)).padStart(2, '0');
      const day = ('' + _datetime.getDate()).padStart(2, '0');
      return {
        type: 'Feature',
        properties: {
          id,
          date: parseInt(year + month + day, 10),
          country,
          cc,
          name,
          shout,
        },
        geometry: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
        },
      };
    }
  ),
};

const FILE = path.resolve('./data/checkins.geojson');
console.log('DONE: writing file ' + FILE);
fs.writeFileSync(FILE, JSON.stringify(geojson, null, '\t'));

const MIN_FILE = path.resolve('./data/checkins.min.json');
console.log('DONE: writing file ' + MIN_FILE);
fs.writeFileSync(MIN_FILE, JSON.stringify(geojson));
