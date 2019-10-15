/** NOTES:
 * 'markdown' contains the release as a String (if you just want to replace something)
 * 'metaData' contains these properties:
 *    changeTypes	      - The types of changes and their descriptions
 *    commits	          - A list of commits since the latest release
 *    groupedCommits	  - Similar to commits, but grouped by the change types
 *    authors	          - The GitHub usernames of the release collaborators
*/

module.exports = async (markdown, metaData) => {
  // Use the available data to create a custom release
  console.log(`\nMarkdown: ${markdown}`);
  return markdown
}

