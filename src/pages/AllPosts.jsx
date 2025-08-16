import React ,{useState, useEffect} from "react";
import appwriteService from '../appwrite/config'
import { PostCard, Container } from "../components";

function AllPosts(){
    const [posts,setPosts] = useState([])
    useEffect(()=>{
        appwriteService.getPosts([]).then((posts)=>{
        if(posts){
            setPosts(posts.documents)
        }
    })
    },[])

    
    if(posts.length===0){
        return(
            <Container>
                <div className="flex flex-wrap">
                    <div className="p-2 w-full">
                        <h1 className="text-2xl font-bold hover:text-gray-500">
                            No Posts to Show
                        </h1>
                    </div>
                </div>
            </Container>
        )
    }

    return(
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post)=>(
                        <div key={post.$id} className="p-2 w-1/4">
                            <PostCard post={post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts