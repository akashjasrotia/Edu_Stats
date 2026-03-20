/**
 * Validates a list of students for data quality before processing them.
 * 
 * Checks for:
 * - missing student names (Error)
 * - missing marks (Error)
 * - marks greater than totalMarks (Error)
 * - negative marks (Error)
 * - duplicate student names (Warning)
 * 
 * @param {Array} students Array of student objects
 * @returns {Object} { errors: [String], warnings: [String] }
 */
const validateData = (students) => {
  const errors = [];
  const warnings = [];

  let missingNames = 0;
  let missingMarks = 0;
  let marksGreaterThanTotal = 0;
  let negativeMarks = 0;

  const namesSeen = new Set();
  const duplicateNames = new Set();

  students.forEach((s) => {
    // Handling multiple possible casing from manual vs excel upload
    const name = s.name || s.Name;
    const marksRaw = s.marks !== undefined ? s.marks : s.Marks;
    const totalMarksRaw = s.totalMarks !== undefined ? s.totalMarks : (s.TotalMarks || s.total_marks || s.Total);

    // 1. Missing names
    if (!name || name.toString().trim() === "") {
      missingNames++;
    } else {
      // 5. Duplicate names (Warning)
      if (namesSeen.has(name)) {
        duplicateNames.add(name);
      } else {
        namesSeen.add(name);
      }
    }

    // 2. Missing marks
    if (marksRaw === undefined || marksRaw === null || marksRaw === "") {
      missingMarks++;
    } else {
      const marks = Number(marksRaw);
      const totalMarks = Number(totalMarksRaw) || 100;

      // 4. Negative marks
      if (marks < 0) {
        negativeMarks++;
      }

      // 3. Marks greater than total marks
      if (marks > totalMarks) {
        marksGreaterThanTotal++;
      }
    }
  });

  // Compile Errors
  if (missingMarks > 0) {
    errors.push(`\u26a0 ${missingMarks} student(s) have missing marks`);
  }
  if (missingNames > 0) {
    errors.push(`\u26a0 ${missingNames} student(s) have missing names`);
  }
  if (marksGreaterThanTotal > 0) {
    errors.push(`\u26a0 ${marksGreaterThanTotal} student(s) have marks greater than total marks`);
  }
  if (negativeMarks > 0) {
    errors.push(`\u26a0 ${negativeMarks} student(s) have negative marks`);
  }

  // Compile Warnings
  if (duplicateNames.size > 0) {
    warnings.push(`\u26a0 ${duplicateNames.size} duplicate name(s) found`);
  }

  return { errors, warnings };
};

module.exports = { validateData };
