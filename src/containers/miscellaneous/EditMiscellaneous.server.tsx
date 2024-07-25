import { getMiscellaneousSettings } from './api/actions';
import EditMiscellaneous from './EditMiscellaneous.client';
import { MiscellaneousSettingsResponse } from './types';

const EditMiscellaneousServer = async () => {
  const miscellaneousSettings: MiscellaneousSettingsResponse =
    await getMiscellaneousSettings();

  return <EditMiscellaneous details={miscellaneousSettings} />;
};

export default EditMiscellaneousServer;
