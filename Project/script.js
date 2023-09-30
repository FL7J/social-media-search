// Retrieve the search result from local storage
const searchResult = localStorage.getItem("searchResult");
let hashtag_id;

// Check if the searchResult is not empty or null
if (searchResult) {
    // Define the base API endpoint for hashtag search (without the query parameter)
    const hashtagSearchEndpoint = "https://graph.facebook.com/v17.0/ig_hashtag_search";

    // Define the query parameters for hashtag search as an object
    const hashtagSearchParams = {
        user_id: "17841458991295711",
        q: searchResult,
        access_token: "EAAXEUZAPPaOYBO3XerHbAq4jMeTySyp8Thed5VXZB03bnYyyOz09ZAfv0kHrxcCK3QjCJntU3Q5VAJGjYWiar77wj7XDemYd27zY6GUxSXjPPtNqF5uqyarKXL2yXEkAFI0A26mmaQPtSSDNFO3yxazbfOrZAO2Um2bZAFwI6gQg3KQBPhQtCZB5Bm" // Replace with your access token
    };

    // Create an array of query parameter strings for hashtag search
    const hashtagSearchQueryParams = Object.entries(hashtagSearchParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);

    // Combine the base endpoint and query parameters for hashtag search
    const hashtagSearchURL = `${hashtagSearchEndpoint}?${hashtagSearchQueryParams.join("&")}`;

    // Send the first API request to get the hashtag_id
    fetch(hashtagSearchURL)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data[0] && data.data[0].id) {
                // Extract hashtag_id from the response
                hashtag_id = data.data[0].id;

                // Define the API endpoint for fetching recent media based on hashtag_id
                const apiEndpoint = `https://graph.facebook.com/${hashtag_id}/recent_media?user_id=17841458991295711&fields=id,media_type,comments_count,media_url,like_count,carousel_media&access_token=EAAXEUZAPPaOYBO3XerHbAq4jMeTySyp8Thed5VXZB03bnYyyOz09ZAfv0kHrxcCK3QjCJntU3Q5VAJGjYWiar77wj7XDemYd27zY6GUxSXjPPtNqF5uqyarKXL2yXEkAFI0A26mmaQPtSSDNFO3yxazbfOrZAO2Um2bZAFwI6gQg3KQBPhQtCZB5Bm`; // Replace with your access token

                // Send the second API request to fetch Instagram posts
                return fetch(apiEndpoint);
            } else {
                console.error("Invalid or unexpected response format for hashtag search:", data);
                return Promise.reject("Invalid response");
            }
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response data as needed and display Instagram posts
            const container = document.querySelector(".grid-container");
            data.data.forEach((post) => {
                // Create and populate post elements as before
                const postElement = document.createElement("div");
                postElement.classList.add("post");

                // Check if the post is a swipable post
                if (post.carousel_media) {
                    // Loop through the carousel media and add each photo or video to the post element
                    post.carousel_media.forEach((media) => {
                        const mediaElement = document.createElement("div");
                        mediaElement.classList.add("media");
                        if (media.media_type === "IMAGE") {
                            mediaElement.innerHTML = `
                              <a href="${media.permalink}" target="_blank">
                                <img src="${media.images.standard_resolution.url}">
                              </a>
                            `;
                        } else if (media.media_type === "VIDEO") {
                            mediaElement.innerHTML = `
                              <a href="${media.permalink}" target="_blank">
                                <video width="100%" height="auto" controls>
                                  <source src="${media.videos.standard_resolution.url}" type="video/mp4">
                                </video>
                              </a>
                            `;
                        }
                        postElement.appendChild(mediaElement);
                    });
                } else {
                    // Add the photo or video to the post element
                    if (post.media_type === "IMAGE") {
                        const mediaElement = document.createElement("div");
                        mediaElement.classList.add("media");
                        mediaElement.innerHTML = `
                            <a href="${post.permalink}" target="_blank">
                              <img src="${post.media_url}">
                            </a>
                          `;
                        postElement.appendChild(mediaElement);
                    } else if (post.media_type === "VIDEO") {
                        const mediaElement = document.createElement("div");
                        mediaElement.classList.add("media");
                        mediaElement.innerHTML = `
                            <a href="${post.permalink}" target="_blank">
                              <video width="100%" height="auto" controls>
                                <source src="${post.media_url}" type="video/mp4">
                              </video>
                            </a>
                          `;
                        postElement.appendChild(mediaElement);
                    }
                }

                // Add the like and comment counts to the post element
                postElement.innerHTML += `
                    <p>Likes: ${post.like_count}</p>
                    <p>Comments: ${post.comments_count}</p>
                  `;

                container.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
} else {
    console.log("Search result is empty or null.");
}
