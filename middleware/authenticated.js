export default function ({ store, route, redirect }) {
  const isSignin = store.getters['user/isSignin']
  if (!isSignin && route.name === 'room-id') {
    redirect('/door/' + route.params.id)
  }
  if (!isSignin && route.name === 'home') {
    redirect('/')
  }
}
