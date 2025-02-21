import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite"

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.banahene2041",
  projectId: "67b65bdb0025a345b998",
  databaseId: "67b65ead002acc30739d",
  userCollectionId: "67b65f600036c24a5d1e",
  videoCollectionId: "67b65fb90018312cf9d4",
  storageId: "67b66344003a5031aa62",
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config

// Init your React Native SDK
const client = new Client()

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )
    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    )
    return newUser
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.getSession("current")
    return session
  } catch (error) {
    try {
      const newSession = await account.createEmailPasswordSession(
        email,
        password
      )
      return newSession
    } catch (sessionError) {
      console.error("Login failed:", sessionError.message)
      throw new Error(sessionError.message)
    }
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")],
    )
    return posts.documents
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    )
    return posts.documents
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    )
    return posts.documents
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId),Query.orderDesc('$createdAt')]
    )
    return posts.documents
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current")
    return session
  } catch (error) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl

  try {
    if (type === "video") {
      fileUrl = await storage.getFileView(storageId, fileId)
    } else if (type === "image") {
      fileUrl = await storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      )
    } else {
      throw new Error("Invalid file type")
    }

    if (!fileUrl) throw new Error("File URL not found")

    return fileUrl
  } catch (error) {
    throw new Error(error.message)
  }
}

export const uploadFile = async (file, fileType) => {
  if (!file) return

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  }

  // console.log(file)
  try {
    const uploaded = await storage.createFile(storageId, ID.unique(), asset)
    const fileUrl = await getFilePreview(uploaded.$id, fileType)

    console.log(uploadFile)

    return fileUrl
  } catch (error) {
    throw new Error(error.message)
  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    )

    return newPost
  } catch (error) {
    throw new Error(error.message)
  }
}
