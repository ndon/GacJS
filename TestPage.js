/********************************************************************************
TabControl
********************************************************************************/

var currentTabPage = null;

function ShowTabPage(tabPage) {
    if (currentTabPage !== null) {
        currentTabPage.classList.remove("Selected");
        currentTabPage.TabButton.classList.remove("Selected");
    }
    currentTabPage = tabPage;
    currentTabPage.classList.add("Selected");
    currentTabPage.TabButton.classList.add("Selected");
}

function CombineTabPage(tabPage, tabButton) {
    tabPage.TabButton = tabButton;
    tabButton.TabPage = tabPage;
    tabButton.addEventListener("click", function (event) {
        ShowTabPage(event.currentTarget.TabPage);
    });
}

function SetupTabControl(tabControl) {
    var tabButtons = tabControl.getElementsByClassName("TabButton");
    var tabPages = tabControl.getElementsByClassName("TabPage");
    for (var i = 0; i < tabButtons.length; i++) {
        CombineTabPage(tabPages[i], tabButtons[i]);
    }

    ShowTabPage(tabPages[0]);
}

/********************************************************************************
Draggable Handler
********************************************************************************/

function GetPx(px) {
    return +px.substr(0, px.length - 2);
}

var bodyOnMouseMove = null;
var bodyOnMouseUp = null;

function TrackMouse(node) {
    bodyOnMouseMove = node.data_onMouseMove;
    bodyOnMouseUp = node.data_onMouseUp;
    DetachMouseEvents(node, false);
}

function UnTrackMouse(node) {
    AttachMouseEvents(node);
    bodyOnMouseMove = null;
    bodyOnMouseUp = null;
}

function AttachMouseEvents(node, onMouseDown, onMouseMove, onMouseUp) {
    if (onMouseDown) node.data_onMouseDown = onMouseDown;
    if (onMouseMove) node.data_onMouseMove = onMouseMove;
    if (onMouseUp) node.data_onMouseUp = onMouseUp;

    node.addEventListener("mousedown", node.data_onMouseDown, false);
    node.addEventListener("mousemove", node.data_onMouseMove, false);
    node.addEventListener("mouseup", node.data_onMouseUp, false);
}

function DetachMouseEvents(node, removeHandler) {
    node.removeEventListener("mousedown", node.data_onMouseDown, false);
    node.removeEventListener("mousemove", node.data_onMouseMove, false);
    node.removeEventListener("mouseup", node.data_onMouseUp, false);

    if (removeHandler) {
        node.data_onMouseDown = undefined;
        node.data_onMouseMove = undefined;
        node.data_onMouseUp = undefined;
    }
}

function InstallResizer(node) {
    var draggableHandle = document.createElement("div");
    draggableHandle.setAttribute("class", "DraggableHandle");
    draggableHandle.style.right = "1px";
    draggableHandle.style.bottom = "1px";
    draggableHandle.style.backgroundColor = "red";
    node.appendChild(draggableHandle);

    var dragging = false;
    var x = 0.0;
    var y = 0.0;

    AttachMouseEvents(
        draggableHandle,
        function (event) {
            if (draggableHandle.style.right !== "") {
                draggableHandle.style.right = "";
                draggableHandle.style.bottom = "";
                draggableHandle.style.left = (node.offsetWidth - draggableHandle.offsetWidth - 1) + "px";
                draggableHandle.style.top = (node.offsetHeight - draggableHandle.offsetHeight - 1) + "px";
            }

            dragging = true;
            x = event.pageX;
            y = event.pageY;
            TrackMouse(draggableHandle);
        },
        function (event) {
            if (dragging) {
                var dx = event.pageX - x;
                var dy = event.pageY - y;
                var width = GetPx(node.style.width) + dx;
                var height = GetPx(node.style.height) + dy;
                if (width < 0 || height < 0) {
                    return;
                }

                node.style.width = width + "px";
                node.style.height = height + "px";
                draggableHandle.style.left = GetPx(draggableHandle.style.left) + dx + "px";
                draggableHandle.style.top = GetPx(draggableHandle.style.top) + dy + "px";

                x = event.pageX;
                y = event.pageY;
            }
        },
        function (event) {
            dragging = false;
            UnTrackMouse(draggableHandle);
        }
    );
}

function InstallMover(node) {
    if (node.style.left === "" || node.style.top === "") {
        return;
    }

    var draggableHandle = document.createElement("div");
    draggableHandle.setAttribute("class", "DraggableHandle");
    draggableHandle.style.left = "1px";
    draggableHandle.style.top = "1px";
    draggableHandle.style.backgroundColor = "blue";
    node.appendChild(draggableHandle);

    var dragging = false;
    var x = 0.0;
    var y = 0.0;

    AttachMouseEvents(
        draggableHandle,
        function (event) {
            dragging = true;
            x = event.pageX;
            y = event.pageY;
            TrackMouse(draggableHandle);
        },
        function (event) {
            if (dragging) {
                var dx = event.pageX - x;
                var dy = event.pageY - y;

                node.style.left = GetPx(node.style.left) + dx + "px";
                node.style.top = GetPx(node.style.top) + dy + "px";

                x = event.pageX;
                y = event.pageY;
            }
        },
        function (event) {
            dragging = false;
            UnTrackMouse(draggableHandle);
        }
    );
}

function InstallDraggableHandlers(node) {
    InstallMover(node);
    InstallResizer(node);
}

window.addEventListener("mousemove", function (event) {
    if (bodyOnMouseMove) {
        bodyOnMouseMove(event);
    }
}, false);

window.addEventListener("mouseup", function (event) {
    if (bodyOnMouseUp) {
        bodyOnMouseUp(event);
    }
}, false);