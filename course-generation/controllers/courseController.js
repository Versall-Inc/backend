const Course = require("../models/Course");
const Unit = require("../models/Unit");
const Chapter = require("../models/Chapter");
const { strict_output } = require("../utils/gptHelper");
const { getUnsplashImage } = require("../utils/unsplashHelper");

const generateCourse = async (req, res) => {
  const { userId, title, units } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized action." });
  }

  try {
    const output_units = await strict_output(
      "You are an AI capable of curating course content...",
      units.map(
        (unit) => `It is your job to create a course about ${title}...`
      ),
      {
        title: "title of the unit",
        chapters: "an array of chapters...",
      }
    );

    const imageSearchTerm = await strict_output(
      "You are an AI capable of finding the most relevant image for a course...",
      `Please provide a good image search term for the title of a course about ${title}.`,
      { image_search_term: "a good search term for the title of the course" }
    );

    const description = await strict_output(
      "You are an AI capable of generating a course description...",
      `Please provide a course description for a course about ${title}.`,
      { description: "a course description" }
    );

    const course_image = await getUnsplashImage(
      imageSearchTerm.image_search_term
    );

    const course = await Course.create({
      creatorId: userId,
      title,
      description: description.description,
      imageUrl: course_image,
      completed: false,
    });

    for (const unit of output_units) {
      const prismaUnit = await Unit.create({
        courseId: course._id,
        name: unit.title,
      });

      for (const chapter of unit.chapters) {
        await Chapter.create({
          unitId: prismaUnit._id,
          name: chapter.chapter_title,
          videoQuery: chapter.youtube_search_query,
        });
      }
    }

    res.status(201).json({ data: course._id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { generateCourse };
