import { useState } from 'react'
import apiClient from '../../api/apiClient'

export default function StudentLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await apiClient.post('/auth/student/login', form)
      setMessage(res.data.message || 'Login successful')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials'
      setMessage(msg)
      alert(msg)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Student Login</h2>
      <form onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <br />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

