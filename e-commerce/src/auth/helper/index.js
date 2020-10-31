import {API} from '../../backend'
import { cartEmpty } from '../../core/helper/carthelper'


export const signup = (user) =>{
    return fetch(`${API}users/`,{
        method:"POST",
        headers:{
            Accept:"application/json",
            "Content-Type":"application/json",
        },
        body: JSON.stringify(user),
    })
    .then((response) =>{
        return response.json()
    })
    .catch((err) => console.log(err))
}



export const signin = (user) =>{
    const formData = new FormData()

    for(const name in user){
        formData.append(name,user[name])
    }

    return fetch(`${API}users/login/`,{
        method:"POST",
        body:formData
    })
    .then((response) => {
        console.log(response)
        return response.json()
    })
    .catch((err) => console.log(err))
}


export const authenticate = (data,next) =>{
    if(typeof window !== undefined){
        localStorage.setItem("jwt",JSON.stringify(data))
        next()
    }
}


export const isAuthenticated = () =>{
    if(typeof window == undefined){
        return false
    }
    if(localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"))
    }else {
        return false
    }
}

export const signout = (next) =>{
    console.log("CHECK ISAUTHENTICATED",isAuthenticated())
    const userId = isAuthenticated() && isAuthenticated().user.id
    console.log("USER ID",userId)
    if(typeof window !== undefined){
        localStorage.removeItem("jwt")
        cartEmpty(()=>{})
        return fetch(`${API}users/logout/${userId}`,{
            method:"GET"
        })
        .then((response)=>{
            console.log("Signout Success")
            next()
        })
        .catch(err =>{console.log(err)})
    }
}