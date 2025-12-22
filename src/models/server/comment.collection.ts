import {IndexType, Permission} from "node-appwrite";
import {commentsCollection, db,} from "../name";
import {databases} from "./config"

export default async function createCommentCollection() {
    // create collection
    await databases.createCollection(db,commentsCollection,commentsCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("comments collection is created");
    // creating attribute and indexes
    await Promise.all([
        databases.createStringAttribute(db,commentsCollection, "content", 10000, true,),
        databases.createStringAttribute(db,commentsCollection, "autherId", 50, true,),
        databases.createStringAttribute(db,commentsCollection, "typeId", 50, true,),
        databases.createEnumAttribute(db,commentsCollection, "typeId", ['answer', 'question'], true,),
    ])
    console.log("comment attribute created");
   
}