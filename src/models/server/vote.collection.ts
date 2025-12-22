import {IndexType, Permission} from "node-appwrite";
import {votesCollection, db,} from "../name";
import {databases} from "./config"

export default async function createVoteCollection() {
    // create collection
    await databases.createCollection(db,votesCollection,votesCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("comments collection is created");
    // creating attribute and indexes
    await Promise.all([
        databases.createEnumAttribute(db,votesCollection, "type",["question,answer"],  true,),
        databases.createStringAttribute(db,votesCollection, "voteId", 50, true,),
        databases.createEnumAttribute(db,votesCollection, "voteStatus", ['upvoted','downvoted'], true,),
        databases.createStringAttribute(db,votesCollection, "votedById", 50, true,),

    ])
    console.log("comment attribute created");
   
}