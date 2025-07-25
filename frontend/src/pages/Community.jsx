import { useEffect, useState } from "react";
import axios from "axios";

export default function Community() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/community")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold">Community</h2>
      {posts.map((post, i) => (
        <div key={i} className="border p-2 mt-2">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>By: {post.author}</p>
        </div>
      ))}
    </div>
  );
}
