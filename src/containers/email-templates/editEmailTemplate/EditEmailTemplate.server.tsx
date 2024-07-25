import { getEmailTemplateDetailsById } from '../api/actions';
import EditEmailTemplate from './EditEmailTemplate.client';

const EditEmailTemplateServer = async ({ id }: { id: string }) => {
  const emailTemplateDetails = await getEmailTemplateDetailsById(id);
  if (emailTemplateDetails) {
    Object.keys(emailTemplateDetails.body).forEach((key) => {
      if (emailTemplateDetails.body[key] === null) {
        emailTemplateDetails.body[key] = '<div><br></div>';
      }
      if (emailTemplateDetails.subject[key] === null) {
        emailTemplateDetails.subject[key] = '<div><br></div>';
      }
    });
  }

  return <EditEmailTemplate emailTemplateDetails={emailTemplateDetails} />;
};

export default EditEmailTemplateServer;
