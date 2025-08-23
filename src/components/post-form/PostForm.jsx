import React , {useCallback, useState} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import service from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({post}){
    //As, here we want errors to show when user not fill whole information, we cannot do it just by maintaining a useState like error. So, we can do it using formState:{errors} of react-hook-form
    const {register,handleSubmit, watch, setValue, control, getValues, formState:{errors}} = useForm({
        defaultValues:{
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active'
        }
    })
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData) //check for error
    const [error,setError] = useState("")

    
    const submit = async (data)=>{   //data={title: 'df', slug: 'df', content: '<p>gs</p>', status: 'active', image: FileList}
        setError("")
        try{
            if(post){
                const file = data.image?.[0] ? await service.fileUpload(data.image[0]) : null   //check for error
                if(file){
                    await service.deleteFile(post.featuredImage)
                }
                const dbPost = await service.updatePost(post.$id,{ //Issue => when user updates post and also gives a image, then data has another field with image, but backend only knows featuredImage which id of image
                    ...data,
                    featuredImage: file? file.$id : post.featuredImage     //what if user do
                })                                                          //not upload image while
                                                                            //updating post, then featuredImage will set to undefined, making problems
                if(dbPost){                                                 //instead of undefined, write post.featuredImage
                    navigate(`/post/${dbPost.$id}`)
                }
            }
            else{
                const file = await service.fileUpload(data.image[0])

                if(file){
                    const fileId= file.$id
                    data.featuredImage = fileId
                    const dbPost = await service.createPost({
                        ...data,
                        userId: userData.$id          
                    })
                    if(dbPost){
                        navigate(`/post/${dbPost.$id}`)
                    }
                }
            }
        }
        catch(error){
            if(error.code===409) setError("Post with the slug is already created. Use different slug value")
            console.log("Error while submitting post : ",error)
        }
    }

    const slugTransform = useCallback((value)=>{
        if(value && typeof value === 'string')       //AI generated, no need to remember
            return value
                    .trim()                           // remove starting, and ending spaces
                    .toLowerCase()
                    .replace(/[^a-zA-Z\d\s]+/g, "-")  // non-alphanumeric → dash
                    .replace(/\s+/g, "-")             // one or more spaces → dash
                    .replace(/-+/g, "-")              // multiple dashes → single dash
                    .replace(/^-|-$/g, "");           // remove dash at start/end

        return ''
    },[])

    // In React Hook Form, watch has two modes:
    // ->Direct value retrieval: const val = watch("fieldName") — no subscription, just gets the current value.
    // ->Subscription mode: watch(callback) — runs callback whenever any form field changes.
    // =>Here you’re using subscription mode to listen to real-time changes in the form.
    
    //Why subscription and unsubscribe
    //watch(callback) returns a subscription object with an .unsubscribe() method.
    //If you didn’t unsubscribe when the component unmounts:
    // =>The callback could still try to run after the component is gone.
    // =>This would cause memory leaks and "update on unmounted component" warnings.
    
    //The return(unsubscribe) in useEffect is the cleanup function, which React calls when:
    // =>Component unmounts.
    // =>Or before running the effect again (if dependencies change).

    
    React.useEffect(()=>{
        //watch syntax basic => const watchedValue = watch(fieldName?);
        //here => value → full form data object(updated) & name → name of the field just changed
        //we have another argument, {name, type}, type is event type which called watch, generally it is "change"
        
        const subscription = watch((value,{name})=>{
            if(name==='title'){
                //setValue - Programmatically sets a value for a form field.
                //Syntax - setValue(fieldName, newValue, options?), where options are optional.
                //shouldValidate -> after setting value, immediately validate it (instantly re-validates the field)
                //After updating the slug field with the new transformed value, immediately run the field’s validation rules and update the error state if any.
                setValue('slug',slugTransform(value.title),{shouldValidate:true})
            }
        })

        return ()=>{
            subscription.unsubscribe()
        }
    },[watch,slugTransform,setValue]) 

    
    return (
        <div>
            {error && 
                <div className="w-full flex justify-center">
                    <p className="text-red-600 mt-1 mb-3 text-center">{error}</p>
                </div>
            }
        
        <div className='flex items-center justify-center w-full'>
                

                <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                    <div className="w-2/3 px-2">
                        
                        <Input
                            label="Title :"
                            placeholder="Title"
                            className="mb-4"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && <p className="text-red-700 text-sm">{errors.title.message}</p>}
                        
                        <Input
                            label="Slug :"
                            placeholder="Slug"
                            className="mb-4"
                            {...register("slug", { required: "Slug is required" })}
                            //this onInput is explicitly done, if user itself tries to change slug, then we can call slugTransform, and change it then and there.
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                            }}
                        />
                        {errors.slug && <p className="text-red-700 text-sm">{errors.slug.message}</p>}

                        {/* getValue -> Reads the current value of one or more fields without subscribing to updates (unlike watch).
                        => watch → Subscribes
                            Think of it like saying: "Hey form, tell me every time this value changes."
                            If the user types, it re-renders and gives you the latest value automatically. 
                        
                        => getValues → No Subscription
                            Think of it like saying:"Hey form, just give me the value right now — I don’t care about future changes."
                            If the field changes later, getValues won’t auto-update unless you explicitly call it again.
                        */}
                        
                        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                        {errors.content && <p className="text-red-700 text-sm">{errors.content.message}</p>}
                    
                    </div>
                    <div className="w-1/3 px-2">
                        
                        <Input
                            label="Featured Image :"
                            type="file"
                            className="mb-4"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post ? "Image is required": false })}
                        />
                        {errors.image && <p className="text-red-700 text-sm">{errors.image.message}</p>}
                        
                        {post && (
                            <div className="w-full mb-4">
                                <img
                                    src={service.getFilePreview(post.featuredImage)}
                                    alt={post.title}
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                        <Select
                            options={["active", "inactive"]}
                            label="Status :"
                            className="mb-4"
                            {...register("status", { required: true })}
                        />
                        
                        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                            {post ? "Update" : "Submit"}
                        </Button>
                    </div>
                </form>
            
        </div>
        </div>
    )
}

export default PostForm