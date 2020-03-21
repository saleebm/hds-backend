import { useForm } from 'react-hook-form'

export function LoginForm() {
  const { register, handleSubmit } = useForm<{
    email: string
    password: string
  }>()

  return <></>
}
