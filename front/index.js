document
        .getElementById("uploadForm")
        .addEventListener("submit", async (event) => {
          event.preventDefault();

          const formData = new FormData();
          formData.append("media", document.getElementById("media").files[0]);
          formData.append("content", document.getElementById("content").value);
          formData.append(
            "username",
            document.getElementById("username").value
          );

          try {
            // Upload the media file
            const mediaResponse = await fetch("/upload", {
              method: "POST",
              body: formData,
            });

            if (!mediaResponse.ok) {
              throw new Error("Error uploading media.");
            }

            const mediaData = await mediaResponse.json();
            const mediaUrl = mediaData.mediaUrl;

            // post response
            const postResponse = await fetch("/create-post", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mediaUrl,
                content: formData.get("content"),
                username: formData.get("username"),
              }),
            });

            if (!postResponse.ok) {
              throw new Error("Error creating post.");
            }

            const postData = await postResponse.json();
            document.getElementById(
              "response"
            ).textContent = `${postData.msg}`;
          } catch (error) {
            document.getElementById(
              "response"
            ).textContent = `Error: ${error.message}`;
          }
        });