import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/bookmarks";
import { hideArticle } from "../reducers/hiddenArticles";
import Image from "next/image";
import styles from "../styles/Article.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Article(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const hiddenArticle = useSelector((state) => state.hiddenArticles.value);

  const handleEyeClick = () => {
    if (!hiddenArticle.find((e) => e.title === props.title)) {
      console.log('hide')
      dispatch(hideArticle(props));
    } else {
      console.log('show')
    }
  };

  let articleStyles;
  if (hiddenArticle.find((e) => e.title === props.title)) {
    articleStyles = { display: "none" };
  }
  //   articleStyles = { display: "block" };
  //   console.log(" hide");
  //   articleStyles = { display: "none" };
  //   console.log("hide", hiddenArticle);

  const handleBookmarkClick = () => {
    if (!user.token) {
      return;
    }
    
    fetch(`http://localhost:3000/users/canBookmark/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result && data.canBookmark) {
          if (props.isBookmarked) {
            dispatch(removeBookmark(props));
          } else {
            dispatch(addBookmark(props));
          }
        }
      });
  };

  let iconStyle = {};
  if (props.isBookmarked) {
    iconStyle = { color: "#E9BE59" };
  }

  return (
    <div className={styles.articles} style={articleStyles}>
      <div className={styles.articleHeader}>
        <h3>{props.title}</h3>
        <FontAwesomeIcon
          onClick={() => handleBookmarkClick()}
          icon={faBookmark}
          style={iconStyle}
          className={styles.bookmarkIcon}
        />
        <FontAwesomeIcon
          onClick={() => handleEyeClick()}
          icon={faEyeSlash}
          // style={articleStyles}
          className={styles.eyeSlashIcon}
        />
      </div>
      <h4 style={{ textAlign: "right" }}>- {props.author}</h4>
      <div className={styles.divider}></div>
      <Image
        src={props.urlToImage}
        alt={props.title}
        width={600}
        height={314}
      />
      <p>{props.description}</p>
    </div>
  );
}

export default Article;
