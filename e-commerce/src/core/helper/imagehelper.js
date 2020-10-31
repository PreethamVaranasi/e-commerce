import React from 'react'

const imagehelper = ({product}) => {
    const imageURL = product ? product.image 
    : 'https://www.freedomdesign.com/wp-content/uploads/2018/03/image-732.jpeg'
    return (
        <div className="rounded border border-success p-2">
            <img src={imageURL}
            style = {{maxHeight:"100%",maxWidth:"100%"}}
            className="mb-3 rounded"
            alt=""
            />
        </div>
    )
}
export default imagehelper