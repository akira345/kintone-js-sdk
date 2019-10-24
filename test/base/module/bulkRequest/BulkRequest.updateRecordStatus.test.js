import Auth from '../../../../src/node/authentication/Auth';
import Connection from '../../../../src/node/connection/Connection';
import BulkRequest from '../../../../src/base/module/bulkRequest/BulkRequest';
// import KintoneAPIException from '../../../../src/base/exception/KintoneAPIException';
import {USERNAME, PASSWORD, DOMAIN} from './common';

describe('Checking BulkRequest.updateRecordStatus function', () => {
  it('is called successfully', () => {
    const auth = new Auth();
    auth.setPasswordAuth({username: USERNAME, password: PASSWORD});
    const connection = new Connection({auth, domain: DOMAIN});
    const bulkRequest = new BulkRequest({connection});

    const updateRecordStatus = bulkRequest.updateRecordStatus();
    expect(bulkRequest).toBeInstanceOf(BulkRequest);
    expect(updateRecordStatus).toBeInstanceOf(BulkRequest);
  });
});