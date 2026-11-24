import * as migration_20260928_082604_initial from './20260928_082604_initial';
import * as migration_20260928_151841_content_model from './20260928_151841_content_model';
import * as migration_20261004_165222_site_facts from './20261004_165222_site_facts';
import * as migration_20261004_173034_latest_end from './20261004_173034_latest_end';
import * as migration_20261004_205526_booking_request_id from './20261004_205526_booking_request_id';
import * as migration_20261004_222941_members_area from './20261004_222941_members_area';
import * as migration_20261026_134541_what_to_bring from './20261026_134541_what_to_bring';
import * as migration_20261123_100902_booking_repairs from './20261123_100902_booking_repairs';
import * as migration_20261124_102301_remove_example from './20261124_102301_remove_example';

export const migrations = [
  {
    up: migration_20260928_082604_initial.up,
    down: migration_20260928_082604_initial.down,
    name: '20260928_082604_initial',
  },
  {
    up: migration_20260928_151841_content_model.up,
    down: migration_20260928_151841_content_model.down,
    name: '20260928_151841_content_model',
  },
  {
    up: migration_20261004_165222_site_facts.up,
    down: migration_20261004_165222_site_facts.down,
    name: '20261004_165222_site_facts',
  },
  {
    up: migration_20261004_173034_latest_end.up,
    down: migration_20261004_173034_latest_end.down,
    name: '20261004_173034_latest_end',
  },
  {
    up: migration_20261004_205526_booking_request_id.up,
    down: migration_20261004_205526_booking_request_id.down,
    name: '20261004_205526_booking_request_id',
  },
  {
    up: migration_20261004_222941_members_area.up,
    down: migration_20261004_222941_members_area.down,
    name: '20261004_222941_members_area',
  },
  {
    up: migration_20261026_134541_what_to_bring.up,
    down: migration_20261026_134541_what_to_bring.down,
    name: '20261026_134541_what_to_bring',
  },
  {
    up: migration_20261123_100902_booking_repairs.up,
    down: migration_20261123_100902_booking_repairs.down,
    name: '20261123_100902_booking_repairs',
  },
  {
    up: migration_20261124_102301_remove_example.up,
    down: migration_20261124_102301_remove_example.down,
    name: '20261124_102301_remove_example'
  },
];
