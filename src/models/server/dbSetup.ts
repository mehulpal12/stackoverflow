import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDB() {
    try {
        await databases.get(db);
        console.log("database collection");
        
    } catch (error) {
        try {
            await databases.create(db,db)
            console.log("database created");
            await Promise.all([
                createCommentCollection(),
                createAnswerCollection(),
                createQuestionCollection(),
                createVoteCollection(),
            ])
            console.log("created collection");
            console.log("db connected");
            
        } catch (error) {
            console.log('error created databases or collection ', error);
            
        }
    }
    return databases
}