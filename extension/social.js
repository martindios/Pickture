// social.js
export function shareOnSocialMedia(url, platform) {
    let shareUrl = "";
  
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case "instagram":
        shareUrl = "https://www.instagram.com/";
        break;
      default:
        return;
    }
  
    window.open(shareUrl, "_blank", "width=600,height=400");
  }
  