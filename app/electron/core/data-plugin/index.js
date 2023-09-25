// Provide an async method to manipulate the price provided by the extension point
const PLUGIN_NAME = "data-plugin";

const getConversations = () =>
  new Promise((resolve) => {
    if (window && window.electronAPI) {
      window.electronAPI
        .invokePluginFunc(PLUGIN_NAME, "getConversations")
        .then((res) => resolve(res));
    } else {
      resolve([]);
    }
  });
const getConversationMessages = (id) =>
  new Promise((resolve) => {
    if (window && window.electronAPI) {
      window.electronAPI
        .invokePluginFunc(PLUGIN_NAME, "getConversationMessages", id)
        .then((res) => resolve(res));
    } else {
      resolve([]);
    }
  });

const createConversation = (conversation) =>
  new Promise((resolve) => {
    if (window && window.electronAPI) {
      window.electronAPI
        .invokePluginFunc(PLUGIN_NAME, "storeConversation", conversation)
        .then((res) => {
          resolve(res);
        });
    } else {
      resolve("-");
    }
  });
const createMessage = (message) =>
  new Promise((resolve) => {
    if (window && window.electronAPI) {
      window.electronAPI
        .invokePluginFunc(PLUGIN_NAME, "storeMessage", message)
        .then((res) => resolve(res));
    } else {
      resolve("-");
    }
  });

const deleteConversation = (id) =>
  new Promise((resolve) => {
    if (window && window.electronAPI) {
      window.electronAPI
        .invokePluginFunc(PLUGIN_NAME, "deleteConversation", id)
        .then((res) => {
          resolve(res);
        });
    } else {
      resolve("-");
    }
  });

const setupDb = () => {
  window.electronAPI.invokePluginFunc(PLUGIN_NAME, "init");
};

const getButton = (text, func) => {
  var element = document.createElement("button");
  element.innerText = text;
  // Add styles to the button element
  element.style.marginTop = "5px";
  element.style.marginRight = "5px";
  element.style.borderRadius = "0.375rem"; // Rounded-md
  element.style.backgroundColor = "rgb(79, 70, 229)"; // bg-indigo-600
  element.style.padding = "0.875rem 1rem"; // px-3.5 py-2.5
  element.style.fontSize = "0.875rem"; // text-sm
  element.style.fontWeight = "600"; // font-semibold
  element.style.color = "white"; // text-white
  element.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"; // shadow-sm
  element.addEventListener("click", func);
  return element;
};
const experimentComponent = () => {
  var parent = document.createElement("div");
  const label = document.createElement("p");
  label.style.marginTop = "5px";
  label.innerText = "Data Plugin";
  parent.appendChild(label);
  const getConvs = getButton("Get Conversation", async () => {
    // Define the action you want to perform when the button is clicked
    alert(JSON.stringify(await getConversations()));
  });
  const spawnConv = getButton("Spawn Conversation", async () => {
    // Define the action you want to perform when the button is clicked
    const id = await createConversation({
      name: "test",
      model_id: "yolo",
    });
    alert("A new conversation is created: " + id);
  });
  const deleteLastConv = getButton("Delete Last Conversation", async () => {
    // Define the action you want to perform when the button is clicked
    const convs = await getConversations();
    await deleteConversation(convs[convs.length - 1].id);
    alert("Last conversation is deleted");
  });
  const spawnMessage = getButton("Spawn Message", async () => {
    const convs = await getConversations();
    await createMessage({
      name: "",
      conversation_id: convs[0].id,
      message: "yoo",
      user: "user",
    });
    alert("Message is created");
  });
  parent.appendChild(getConvs);
  parent.appendChild(spawnConv);
  parent.appendChild(deleteLastConv);
  parent.appendChild(spawnMessage);
  return parent;
};

// Register all the above functions and objects with the relevant extension points
export function init({ register }) {
  setupDb();
  register("getConversations", "getConv", getConversations, 1);
  register("createConversation", "insertConv", createConversation);
  register("deleteConversation", "deleteConv", deleteConversation);
  register("createMessage", "insertMessage", createMessage);
  register("getConversationMessages", "getMessages", getConversationMessages);

  // Experiment UI - for Preferences
  register(
    "experimentComponent",
    "data-plugin-experiment-component",
    experimentComponent
  );
}