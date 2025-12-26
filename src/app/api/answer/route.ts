import { databases } from "@/models/client/config";
import { answerCollection, db } from "@/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import { users } from "@/models/server/config";

export async function POST(request: NextRequest) {
    
    try {
        const {questionId, answer, authorId } =  await request.json();

       const response = await databases.createDocument(db, answerCollection, ID.unique(),{
        content: answer,
        authorId: authorId,
        questionId: questionId,
       })

      const prefs =await users.getPrefs<UserPrefs>(authorId)

      await users.updatePrefs(authorId, {
        reputation: Number(prefs.reputation) + 1,
      })

      return NextRequest.json(response, {
        status: 201
      })


    } catch (error: any) {
        return NextResponse.json(
            {
                error:error?.message || "error createing answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }


}

export async function DELETE(request: NextRequest) {
    try {
        
    } catch (error: any) {
         return NextResponse.json(
            {
                error:error?.message || "error createing answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}