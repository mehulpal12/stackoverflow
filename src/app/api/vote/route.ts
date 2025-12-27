import { databases } from "@/models/client/config";
import { answerCollection, db, questionCollection, votesCollection } from "@/models/name";
import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    // grab data
    const { votedById, voteStatus, type, typeId } = await request.json();
    // list document

    const response = await databases.listDocuments(db, votesCollection, [
      Query.equal("type", type),
      Query.equal("votedById", votedById),
      Query.equal("voteStatus", voteStatus),
      Query.equal("typeId", typeId),
    ]);

    if (response.documents.length > 0) {
        await databases.deleteDocument(db,votesCollection, response.documents[0].$id)

        const QuestionAnswer = await databases.getDocument(db,
            type === "question" ? questionCollection: answerCollection,
            typeId
        );
        const authorPrefs = await users.getPrefs<UserPrefs>(QuestionAnswer.authorId)

        await users.updatePrefs<UserPrefs>(QuestionAnswer.authorId, {
            reputation:response.documents[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation) - 1 :
            Number(authorPrefs.reputation) + 1 
        })


    }

    if (response.documents[0]?.voteStatus != voteStatus) {
    }

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, votesCollection, [
        Query.equal("type", type),
        Query.equal("votedById", votedById),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("typeId", typeId),
        Query.limit(1),
      ]),
       databases.listDocuments(db, votesCollection, [
        Query.equal("type", type),
        Query.equal("votedById", votedById),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("typeId", typeId),
        Query.limit(1),
      ]),
    ]);


    return NextResponse.json({
        data:{
            document: null, voteResult: upvotes.total = downvotes.total
        },
        message:'vote handled'
    },{
        status:200
    }
)

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "error createing voting",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}
