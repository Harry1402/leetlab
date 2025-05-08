import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  getLanguageName,
  submitBatch
} from "../libs/judge0.lib.js"

import { pollBatchResults } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  // going to check the user role once again

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      //
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      sucess: true,
      message: "Message Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany()
    if (!problems) {
      res.status(404).json({
        error: "No problem Found"
      });
    }

    res.status(200).json({
      message: "Problem fetched successfully",
      sucess: true,
      problems,
    })

  } catch (error) {
    console.log(error)
    res.status(404).json({
      error: "Error while fetching the problem"
    });
  }

};

export const getProblemsById = async (req, res) => {
  const { id } = req.body; //yahe pe req.params se bhej raha tha to nhi gaya,aur get ko post kar diya
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });


    if (!problem) {
      res.status(404).json({
        error: `No problem with${id} Found`
      });
    }

    res.status(200).json({
      message: `Problem fetched successfully with ${id}`,
      sucess: true,
      problem,
    })


  } catch (error) {
    console.log(error)
    res.status(404).json({
      error: `Error while fetching the problem by ${id}`
    });
  }
};

export const updateProblem = async (req, res) => {
  //checking for the user role ,if he is Admin ,allowing further
  const { id } = req.body;
  const { title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions, } = req.body;
  try {
    const problem = await db.problem.findUnique({
      where: { id, }
    },)
    if (!problem) {
      return res.status(404).json({ error: `Problem  not found.` });
    }

    try {
      for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId) {
          return res.status(400).json({
            error: `language ${language} is not supported`
          })
        }
        const submissions = testcases.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));

        const submissionResults = await submitBatch(submissions);
        const tokens = submissionResults.map((res) => res.token);
        const results = await pollBatchResults(tokens);

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          console.log("Result-----", result);
          // console.log(
          //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
          // );
          if (result.status.id !== 3) {
            return res.status(400).json({
              error: `Testcase ${i + 1} failed for language ${language}`,
            });
          }
        }
      }

      const updateProblem = await db.problem.update({
        where: { id, },
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        sucess: true,
        message: "Problem Updated Successfully",
        problem: updateProblem,
      });



    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: "Error while Updating The Problem",
        
      })

    }
  }
  catch (err) {

    res.status(404).json({ error: `Error while fetching the problem` });

  }

}

export const deleteProblem = async (req, res) => {
  const { id } = req.body;  //yaha pe bhi params hatake body lagaya ,jab work nhi kiya tab
  try {
    const problem = await db.problem.findUnique({
      where: { id },
    }
    );

    if (!problem) {
     return  res.status(404).json({
        error: `problem  not found`
      })}

      const deleteProblem = await  db.problem.delete({
        where: { id, },
      });

      res.status(200).json({
        success: true,
        message: `Problem deleted sccessfully`,
        problem: deleteProblem
      })
   
  } catch (error) {
    res.status(400).json({
      error: "Error while deleting the problem"
    });
  }

};

export const getAllProblemsSolvedByUser = async (req, res) => {try {
  const problems = await db.problem.findMany({
    where:{
      solvedBy:{
        some:{
          userId:req.user.id
        }
      }
    },
    include:{
      solvedBy:{
        where:{
          userId:req.user.id
        }
      }
    }
  })

  if(!problems){
    res.status(400).json("No Problems exist")
  }

  res.status(200).json({
    success:true,
    message :'Problems Fetched Successfully',
    problems
  })
} catch (error) {
  console.error("Error fetching problems :" , error);
    res.status(500).json({error:"Failed to fetch problems"})
  
}

};

