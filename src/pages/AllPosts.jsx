import React ,{useState, useEffect} from "react";
import appwriteService from '../appwrite/config'
import { PostCard, Container } from "../components";
import { Query } from "appwrite";

function AllPosts(){
    const [posts,setPosts] = useState([])
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        setLoading(true)
        appwriteService.getPosts().then((posts)=>{
            if(posts){
                setPosts(posts.documents)
            }
        })
        .finally(()=>setLoading(false))
    },[])

    if(loading){
        return(<h1>Loading...</h1>)
    }
    else if(posts.length===0){
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
                            {/* React always passes props as a single object to your component function.
                                So under the hood, when you write: <PostCard $id="123" title="My Blog" featuredImage="abc.png" />
                                React is really calling: PostCard({ $id: "123", title: "My Blog", featuredImage: "abc.png" })
                                That means your component will always receive one argument: props (an object).
                                => And, when you destructure in original componet, you will get what you need */}
                            
                            {/* <PostCard post={post}/>  => This will not work , it will store, PostCard({{post}}) */}
                            {/* <PostCard {...post}/>  => It will work, it will store, PostCard({post}) */}
                            <PostCard {...post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts