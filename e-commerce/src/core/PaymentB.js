import React,{useState,useEffect} from 'react'
import {Redirect} from "react-router-dom"
import {addItemtoCart, cartEmpty} from "./helper/carthelper"
import {getmeToken,processPayment} from "./helper/paymenthelper"
import {createOrder} from "./helper/orderhelper"
import {isAuthenticated,signout} from "../auth/helper"

import DropIn from "braintree-web-drop-in-react"

const PaymentB = ({
    products,
    reload = undefined,
    setReload = f => f
})=> {
    const [info,setInfo] = useState({
        loading:false,
        success:false,
        clientToken:null,
        error:"",
        instance:{}
    })

    const userId = isAuthenticated() && isAuthenticated().user.id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId,token)=>{
        getmeToken(userId,token)
        .then(info =>{
            if(info.error){
                setInfo({
                    ...info,
                    error:info.error
                })
                signout(()=>{
                    return <Redirect to="/signin"/>
                })
            }else{
                const clientToken = info.clientToken
                console.log("INFO",info)
                setInfo({
                    clientToken
                })
            }
        })
    }

    useEffect(()=>{
        getToken(userId,token)
    },[])

    const getAmount = ()=>{
        let amount = 0
        products.map((p)=>{
            amount = amount + parseInt(p.price)
        })
        return amount
    }

    const onPurchase = () =>{
        setInfo({loading:true})
        let nounce
        let getNounce = info.instance.requestPaymentMethod()
        .then(data =>{
            nounce=data.nounce
            const paymentData ={
                paymentMethodNounce: nounce,
                amount:getAmount()
            }
            processPayment(userId,token,paymentData)
            .then(response =>{
                console.log("PROCESS PAYMENT",response)
                if(response.error){
                    if(response.code == '1'){
                        console.log("Payment Failed")
                    }
                    signout(()=>{
                        return <Redirect to="/"/>
                    })
                }else {
                    setInfo({
                        ...info,
                        success:response.success,
                        loading:false
                    })
                    console.log("PAYMENT SUCCESS")
                    let product_names = ""
                    products.forEach(item => {
                        product_names += item.name + ", "
                    });
                    const orderData = {
                        products:product_names,
                        transaction_id:response.transaction.id,
                        amount : response.transaction.amount
                    }
                    createOrder(userId,token,orderData)
                    .then(response =>{
                        if(response.error){
                            if(response.code == "1"){
                                console.log("ORDER FAILED")
                            }
                            signout(()=>{
                                return <Redirect to="/"/>
                            })
                        }
                        else{
                            if(response.success == true){
                                console.log("ORDER PLACED")
                            }
                        }
                    })
                    .catch(err =>{
                        setInfo({loading:false,success:false})
                        console.log("ORDER FAILED",err)
                    })
                    cartEmpty(()=>{
                        console.log("CART IS EMPTYED OUT")
                    })
                    setReload(!reload)
                }
            })
            .catch(e =>{console.log(e)})
        })
        .catch(e => {console.log(e)})
    }

    const showbtnDropIn = () =>{
        return(
            <div>
                {
                    info.clientToken !== null && products.length > 0 ? (
                        // {
                            <div>
                                <DropIn
                                options={{authorization:info.clientToken}}
                                onInstance={instance => {info.instance = instance}}
                                >
                                </DropIn>
                                <button className="btn btn-block btn-success" onClick = {onPurchase}>Buy Now</button>
                                
                            </div>
                        // }
                    ) : (
                        // {
                            <h3>Please login first or add something in cart</h3>
                        // }
                    )
                }
            </div>
        )
    }
    return (
        <div>
            <h3>Your amount is {getAmount()}</h3>
            {showbtnDropIn()}
        </div>
    )
}

export default PaymentB