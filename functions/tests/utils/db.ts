import axios from "axios";

export async function __clearAllDataOnEmulator__() {
  return axios.delete(
    "http://localhost:8080/emulator/v1/projects/fractalhub-612ee/databases/(default)/documents",
  );
}
