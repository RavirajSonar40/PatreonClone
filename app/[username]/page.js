import React from "react"
import PaymentPage from "@/components/paymentpage"

const Username = ({ params }) => {
  


  return (
    <>
      <PaymentPage username={params.username}/>
    </>
  )
}

export default Username
