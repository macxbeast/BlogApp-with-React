import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import conf from '../conf/conf'

export default function RTE({
    name,control,label,defaultValue=""
}){
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
                              {/* why are we using controller:
                              react-hook-form normally works directly with native inputs (<input>, <textarea>, <select>) via ref and register.
                              But TinyMCE's Editor is not a native input(third party) — it:
                                Doesn’t accept a ref in a way react-hook-form expects.
                                Uses its own onEditorChange event instead of the usual onChange */}
            <Controller       // Baseline is we are doing the same thing what we do in forward ref, but with different syntax
            name={name || 'content'}
            control={control}
            render = {({field: {onChange}})=>(
                <Editor
                    apiKey={conf.tinymceApiKey}
                    initialValue={defaultValue}
                    init={{
                        initialValue: defaultValue,
                        height: 500,
                        menubar: true,
                        plugins: [
                        "image",
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                        "anchor",
                        ],
                        toolbar:
                        "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                    }}
                    onEditorChange={onChange}
                />
            )}
            />
        </div>
    )
}