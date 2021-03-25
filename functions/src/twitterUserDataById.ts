module.exports = async (
  access_token_key: String,
  access_token_secret: String,
  userId: String
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
      user_id: userId,
    })
    if (response[0]) {
      const userJson = {
        twitter: '@' + response[0].screen_name,
        name: response[0].name,
        twitter_id: response[0].id_str,
        icon: response[0].profile_image_url_https.replace('_normal', '_bigger'),
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
