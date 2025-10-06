import React, { useEffect, useState } from "react";
import "./PostDetail.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostGallery from "../../features/postDetail/postGallery/PostGallery";
import PostMainInfo from "../../features/postDetail/postMainInfo/PostMainInfo";
import PostOwner from "../../features/postDetail/postOwner/PostOwner";
import PostContact from "../../features/postDetail/postContact/PostContact";
import RelatedPosts from "../../features/postDetail/relatedPosts/RelatedPosts";
import PostDescription from "../../features/postDetail/postDescription/PostDescription";
import { getPostById } from "../../services/postApi";

const PostDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPostById(id)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Không tìm thấy bài đăng");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="post-detail">Đang tải bài đăng...</div>;
  }

  if (error || !post) {
    return (
      <div className="post-detail">{error || "Không tìm thấy bài đăng"}</div>
    );
  }

  return (
    <div className="post-detail">
      {/* Cột trái */}
      <div className="post-detail__left">
        <div className="left-top">
          <PostGallery images={post.images} />
          <PostMainInfo post={post} />
        </div>

        <PostDescription
          description={post.description}
          phone={post.owner?.phone}
        />

        <RelatedPosts />
      </div>

      {/* Cột phải */}
      <div className="post-detail__right">
        <PostOwner owner={post.owner} />
        <PostContact />
      </div>
    </div>
  );
};

export default PostDetail;
