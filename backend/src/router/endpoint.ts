import cors from "cors";
import { Router } from "express";
import { slow, limiter } from "../utils/limit-options";

// PornHub
import { getPornhub } from "../controller/pornhub/pornhubGet";
import { searchPornhub } from "../controller/pornhub/pornhubSearch";
import { randomPornhub } from "../controller/pornhub/pornhubRandom";
import { relatedPornhub } from "../controller/pornhub/pornhubGetRelated";

// XNXX
import { getXnxx } from "../controller/xnxx/xnxxGet";
import searchXnxx from "../controller/xnxx/xnxxSearch";
import { relatedXnxx } from "../controller/xnxx/xnxxGetRelated";
import { randomXnxx } from "../controller/xnxx/xnxxRandom";

// RedTube
import { getRedtube } from "../controller/redtube/redtubeGet";
import { searchRedtube } from "../controller/redtube/redtubeSearch";
import { relatedRedtube } from "../controller/redtube/redtubeGetRelated";
import { randomRedtube } from "../controller/redtube/redtubeRandom";

// Xvideos
import { getXvideos } from "../controller/xvideos/xvideosGet";
import searchXvideos from "../controller/xvideos/xvideosSearch";
import { randomXvideos } from "../controller/xvideos/xvideosRandom";
import { relatedXvideos } from "../controller/xvideos/xvideosGetRelated";
import { watchXvideos } from "../controller/xvideos/xvideosWatch";
import { proxyXvideosStream } from "../controller/xvideos/xvideosProxy";
import { proxyImage } from "../controller/xvideos/xvideosImageProxy";

// Comments & Likes
import { getComments, postComment, likeComment, replyComment } from "../controller/comments/commentController";
import { getLikes, toggleLike } from "../controller/likes/likeController";

// Admin
import { adminLogin, getDashboard, getUsers, getUserActivity, getAllComments, deleteComment, getAnalytics } from "../controller/admin/adminController";
import { adminAuth } from "../middleware/adminAuth";
import { sessionTracking } from "../middleware/sessionTracking";

// Xhamster
import { getXhamster } from "../controller/xhamster/xhamsterGet";
import { searchXhamster } from "../controller/xhamster/xhamsterSearch";
import { randomXhamster } from "../controller/xhamster/xhamsterRandom";
import { relatedXhamster } from "../controller/xhamster/xhamsterGetRelated";

// YouPorn
import { getYouporn } from "../controller/youporn/youpornGet";
import { searchYouporn } from "../controller/youporn/youpornSearch";
import { relatedYouporn } from "../controller/youporn/youpornGetRelated";
import { randomYouporn } from "../controller/youporn/youpornRandom";

function scrapeRoutes() {
  const router = Router();

  router.get("/pornhub/get", cors(), slow, limiter, getPornhub);
  router.get("/pornhub/search", cors(), slow, limiter, searchPornhub);
  router.get("/pornhub/random", cors(), slow, limiter, randomPornhub);
  router.get("/pornhub/related", cors(), slow, limiter, relatedPornhub);
  router.get("/xnxx/get", cors(), slow, limiter, getXnxx);
  router.get("/xnxx/search", cors(), slow, limiter, searchXnxx);
  router.get("/xnxx/related", cors(), slow, limiter, relatedXnxx);
  router.get("/xnxx/random", cors(), slow, limiter, randomXnxx);
  router.get("/redtube/get", cors(), slow, limiter, getRedtube);
  router.get("/redtube/search", cors(), slow, limiter, searchRedtube);
  router.get("/redtube/related", cors(), slow, limiter, relatedRedtube);
  router.get("/redtube/random", cors(), slow, limiter, randomRedtube);
  router.get("/xvideos/get", cors(), slow, limiter, getXvideos);
  router.get("/xvideos/search", cors(), slow, limiter, searchXvideos);
  router.get("/xvideos/random", cors(), slow, limiter, randomXvideos);
  router.get("/xvideos/related", cors(), slow, limiter, relatedXvideos);
  router.get("/xvideos/watch", cors(), slow, limiter, watchXvideos);
  router.get("/xvideos/proxy", cors(), proxyXvideosStream);
  
  // Image proxy untuk semua platform (no rate limit untuk performance)
  router.get("/image/proxy", cors(), proxyImage);
  
  router.get("/xhamster/get", cors(), slow, limiter, getXhamster);
  router.get("/xhamster/search", cors(), slow, limiter, searchXhamster);
  router.get("/xhamster/random", cors(), slow, limiter, randomXhamster);
  router.get("/xhamster/related", cors(), slow, limiter, relatedXhamster);
  router.get("/youporn/get", cors(), slow, limiter, getYouporn);
  router.get("/youporn/search", cors(), slow, limiter, searchYouporn);
  router.get("/youporn/related", cors(), slow, limiter, relatedYouporn);
  router.get("/youporn/random", cors(), slow, limiter, randomYouporn);
  
  // Comments & Likes (with session tracking)
  router.get("/comments", cors(), sessionTracking, getComments);
  router.post("/comments", cors(), sessionTracking, postComment);
  router.post("/comments/like", cors(), sessionTracking, likeComment);
  router.post("/comments/reply", cors(), sessionTracking, replyComment);
  router.get("/likes", cors(), sessionTracking, getLikes);
  router.post("/likes/toggle", cors(), sessionTracking, toggleLike);
  
  // Admin routes (protected)
  router.post("/admin/login", cors(), adminLogin);
  router.get("/admin/dashboard", cors(), adminAuth, getDashboard);
  router.get("/admin/users", cors(), adminAuth, getUsers);
  router.get("/admin/users/:sessionId", cors(), adminAuth, getUserActivity);
  router.get("/admin/comments", cors(), adminAuth, getAllComments);
  router.delete("/admin/comments/:commentId", cors(), adminAuth, deleteComment);
  router.get("/admin/analytics", cors(), adminAuth, getAnalytics);
  
  return router;
}

export default scrapeRoutes;