/**
 * Usage: node update-cfn-template.js <coreImageId>
 *
 * Description:
 * This script takes the CloudFormation template file ('cfn-template.json') and updates the CoreService's image
 * identifier with the provided <coreImageId> value. The updated template is then written to a new file named
 * 'cfn-template-with-core-tag.json'.
 *
 * Arguments:
 *   <coreImageId> (required): The Core image ID to set as the 'ImageIdentifier' property for the CoreService.
 *
 * Example:
 *   node update-cfn-template.js 12345
 *     This will update the 'cfn-template.json' file, setting the 'ImageIdentifier' property of 'CoreService' to '12345',
 *     and save the modified template to 'cfn-template-with-core-tag.json'.
 */

const usageTxt = `Usage: node update-cfn-template.js <coreImageId>

Description:
This script takes the CloudFormation template file ('cfn-template.json') and updates the CoreService's image
identifier with the provided <coreImageId> value. The updated template is then written to a new file named
'cfn-template-with-core-tag.json'.

Arguments:
  <coreImageId> (required): The Core image ID to set as the 'ImageIdentifier' property for the 'CoreService' resource.

Example:
  node update-cfn-template.js 12345
    This will update the 'cfn-template.json' file, setting the 'ImageIdentifier' property of 'CoreService' to '12345',
    and save the modified template to 'cfn-template-with-core-tag.json'.
`;

const fs = require('fs');

if (process.argv.length !== 3) {
  console.error('Expects exactly 1 argument, the Core image ID!');
  process.exit(1);
}

if (process.argv[2] === '-h' || process.argv[2] === '--help') {
  console.log(usageTxt);
}

const coreImageId = process.argv[2];

const inputTemplateLocation = 'cfn-template.json';
const outputTemplateLocation = 'cfn-template-with-core-tag.json';

const cfnTemplateBuffer = fs.readFileSync(inputTemplateLocation);
const cfnTemplate = JSON.parse(cfnTemplateBuffer);
cfnTemplate.Resources.CoreService.Properties.SourceConfiguration.ImageRepository.ImageIdentifier = coreImageId;

fs.writeFileSync(outputTemplateLocation, JSON.stringify(cfnTemplate, null, 2));
