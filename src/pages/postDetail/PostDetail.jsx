import React from "react";
import "./PostDetail.scss";
import { useParams } from "react-router-dom";
import dummyPosts from "../../utils/mockData";
import PostGallery from "../../components/postDetail/postGallery/PostGallery";
import PostMainInfo from "../../components/postDetail/postMainInfo/PostMainInfo";
import PostOwner from "../../components/postDetail/postOwner/PostOwner";
import PostContact from "../../components/postDetail/postContact/PostContact";
import RelatedPosts from "../../components/postDetail/relatedPosts/RelatedPosts";
import PostDescription from "../../components/postDetail/postDescription/PostDescription";

const PostDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const post = dummyPosts.find((p) => p.id === Number(id));

  if (!post) {
    return <div className="post-detail">Không tìm thấy bài đăng</div>;
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
          description={post.descDetail}
          phone={post.owner?.phone}
        />
        <RelatedPosts posts={dummyPosts.slice(0, 4)} />
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
