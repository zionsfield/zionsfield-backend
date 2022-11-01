import { NotFoundError } from "../errors/not-found-error";
import { TermModel } from "../models/terms.model";

/* Services */
export const getTerms = async () => {
  return await TermModel.find().sort({
    createdAt: "desc",
  });
};

export const getSessions = async () => {
  return await TermModel.find({ term: 1 }).sort({
    createdAt: "desc",
  });
};

export const getCurrentTerm = async () => {
  const terms = await getTerms();
  return terms[0];
};

export const addTerm = async () => {
  const currTerm = await getCurrentTerm();
  if (!currTerm) throw new NotFoundError("Term");
  const currSessionStartYear = currTerm.startYear;
  const currSessionEndYear = currTerm.endYear;
  const currSessionTerm = currTerm.term;
  let newSessionStartYear = currSessionStartYear;
  let newSessionEndYear = currSessionEndYear;
  let newSessionTerm: number;
  if (currSessionTerm < 3) newSessionTerm = currSessionTerm + 1;
  else {
    newSessionStartYear = currSessionStartYear + 1;
    newSessionEndYear = currSessionEndYear + 1;
    newSessionTerm = 1;
  }
  const newTerm = await TermModel.build({
    startYear: newSessionStartYear,
    endYear: newSessionEndYear,
    term: newSessionTerm,
  }).save();
};

export const addSession = async () => {
  await addTerm();
  await addTerm();
  await addTerm();
};
