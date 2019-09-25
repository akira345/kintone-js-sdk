import Auth from '../../../../src/base/authentication/Auth';
import Connection from '../../../../src/base/connection/Connection';
import Record from '../../../../src/base/module/record/Record';
import {URI, PASSWORD_AUTH_HEADER, USERNAME, PASSWORD, DOMAIN, getPasswordAuth} from './common';
import nock from 'nock';
import KintoneAPIException from '../../../../src/base/exception/KintoneAPIException';

const auth = new Auth();
auth.setPasswordAuth({username: USERNAME, password: PASSWORD});
const connection = new Connection({auth, domain: DOMAIN});
const recordModule = new Record({connection});

const RECORDS_STATUS_ROUTE = '/k/v1/records/status.json';

describe('Checking Record.updateRecordsStatus', () => {
  it('should be called successfully', () => {
    const data = {
      app: 1,
      records: [{
        id: 1,
        action: 'Submit',
        assignee: 'user1',
        revision: 2
      },
      {
        id: 2,
        action: 'Approve',
        assignee: 'user1',
        revision: 1
      }]
    };

    const expectResult = {'revision': '3'};

    nock(URI)
      .put(RECORDS_STATUS_ROUTE, (rqBody) => {
        expect(rqBody).toEqual(data);
        return true;
      })
      .matchHeader(PASSWORD_AUTH_HEADER, (authHeader) => {
        expect(authHeader).toBe(getPasswordAuth(USERNAME, PASSWORD));
        return true;
      })
      .matchHeader('Content-Type', (type) => {
        expect(type).toEqual(expect.stringContaining('application/json'));
        return true;
      })
      .reply(200, expectResult);
    const updateRecordsStatusResult = recordModule.updateRecordsStatus(data);
    return updateRecordsStatusResult.then((rsp) => {
      expect(rsp).toMatchObject(expectResult);
    });
  });

  it('should throw error when called with empty parameter', () => {
    const data = {
      app: 1,
      records: [{
        id: 1,
        action: 'Submit',
        assignee: 'user1',
        revision: 2
      },
      {
        id: 2,
        action: 'Approve',
        assignee: 'user1',
        revision: 1
      }]
    };

    const expectResult = {'revision': '3'};

    nock(URI)
      .put(RECORDS_STATUS_ROUTE, (rqBody) => {
        expect(rqBody).toEqual(data);
        return true;
      })
      .matchHeader(PASSWORD_AUTH_HEADER, (authHeader) => {
        expect(authHeader).toBe(getPasswordAuth(USERNAME, PASSWORD));
        return true;
      })
      .matchHeader('Content-Type', (type) => {
        expect(type).toEqual(expect.stringContaining('application/json'));
        return true;
      })
      .reply(200, expectResult);
    const updateRecordsStatusResult = recordModule.updateRecordsStatus();
    return updateRecordsStatusResult.catch((err) => {
      expect(err).toBeInstanceOf(KintoneAPIException);
    });
  });
});