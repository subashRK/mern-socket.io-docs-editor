const Error = ({ error }) => {
  return (
    <div className="alert alert-danger py-2 px-3" role="alert">
      {error}
    </div>
  )
}

export default Error
