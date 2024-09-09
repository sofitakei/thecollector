import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [id, setId] = useState()

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from('properties').select(`name`)

      console.log({ data })
    }
    getData()
    console.log('get properties', { id })
  }, [id])
  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session
      console.log({ user })
      const { data, error } = await supabase
        .from('profiles')
        .select(`id, first_name`)
        .eq('auth_user_id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setId(data.id)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id,
      first_name: username,
      updated_at: new Date(),
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile} className='form-widget'>
      <div>
        <label htmlFor='email'>Email</label>
        <input id='email' type='text' value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor='username'>Name</label>
        <input
          id='username'
          type='text'
          required
          value={username || ''}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='website'>Website</label>
        <input
          id='website'
          type='url'
          value={website || ''}
          onChange={e => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button
          className='button block primary'
          type='submit'
          disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button
          className='button block'
          type='button'
          onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  )
}
