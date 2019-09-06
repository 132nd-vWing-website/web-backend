/** USE THIS FILE TO CONFIGURE WEBHOOKS FUNCTIONALITY 
 * 
 * Each webhook should have a descriptive key, with a function as its value. This function 
 * can then be referenced in the routes, triggering the webhook on updates.
 * 
*/

module.exports = {
  POST_NEW_EVENT: (req) => {
    const { id, name, date } = req.body;
    const url = `www.someService.com/events/new?id=${id}&name=${name}&date=${date}`

    return new Promise((resolve) => {
      // TODO - Make the request to the url
      resolve(true)  // or some other result
    })
  },
  SOME_OTHER_HOOK: () => null,
}