import {API}  from "../../backend"

export const getmeToken =(userId,token) =>{
    return fetch(`${API}payment/gettoken/${userId}/${token}`,{
        method:"GET"
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err))
}

export const processPayment = (userId,token,paymentinfo)=>{
    const formData = new FormData()

    for(const name in paymentinfo){
        formData.append(name,paymentinfo[name])
    }
    return fetch(`${API}payment/process/${userId}/${token}`,{
        method:"POST",
        body:formData
    })
    .then(response =>{
        return response.json()
    })
    .catch(err => console.log(err))
}