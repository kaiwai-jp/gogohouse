module.exports = async (
  access_token_key: String,
  access_token_secret: String,
  screenName: String
) => {
  const Twitter = require('twitter')

  let twitter_credentials = require('./twitterCredentials')
  twitter_credentials = {
    ...twitter_credentials,
    access_token_key,
    access_token_secret,
  }
  try {
    const client = new Twitter(twitter_credentials)
    const response = await client.get('users/lookup', {
      screen_name: screenName.substring(1),
    })
    if (response[0]) {
      const userJson = {
        twitter: screenName,
        name: response[0].name,
        twitter_id: response[0].id_str,
        icon: response[0].profile_image_url_https,
        profile: response[0].description,
      }
      return userJson
    }
  } catch (err) {
    console.log(err)
    throw err
  }
  return null
}
