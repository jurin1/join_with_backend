function bodySummaryHTML() {

    return `<div class="bodySummary">
    <div class="summarySelektor1">
      <a href="/assets/templates/board.html" class="todo tile hoverCube" onclick="addActiveStyle(3)">
      <div class="pencilCount">
        <div class="doneImg">
          <img src="/assets/img/todo.svg" alt="" class="svgImgNormal">
          <img src="/assets/img/todo_invert.svg" alt="" class="svgImgHoverTodo">
        </div>
        <div class="doneCount hoverCube">
          <p id="todoSummary">${todo.length}<span>To-do</span></p>
        </div>
        </div>
      </a>
      <a href="/assets/templates/board.html" class="done tile hoverCube" onclick="addActiveStyle(3)">
      <div class="checkCount">
        <div class="doneImg">
          <img src="/assets/img/done.svg" alt="" class="svgImgNormal">
          <img src="/assets/img/done_invert.svg" alt="" class="svgImgHoverDone">
        </div>
        <div class="doneCount">
          <p id="doneSummary">${done.length}<span>Done</span></p>
        </div>
        </div>
      </a>
    </div>
    <a  href="/assets/templates/board.html" class="priocountContainer" onclick="addActiveStyle(3)">
      <div class="summarySelektor2 hoverCube tile">
        <div class="urgentCount" >
          <div class="group7">
            <img src="/assets/img/Prio alta.svg" alt="">
          </div>
          <div class="doneCount">
            <p id="urgentSummary">${urgent.length}<span>Urgent</span></p>
          </div>
        </div>
          <div ><img src="/assets/img/vector.svg" alt=""></div>
          <div class="frame68">
            <span id="deadlineSummary">${upcomingDate}</span>
            <span>Upcoming Deadline</span>
          </div>
        </div>
    </a>
    <div class="summarySelektor3" onclick="addActiveStyle(3)">
      <a href="/assets/templates/board.html" class="square-button tile hoverCube">
        <div class="frame">
          <div ><span id="tasksSummary" class="element">${howManyTasks}</span></div>
          <div class="tasks-on-board"><span>Task in<br />Board</span></div>
        </div>
    </a>
      <a href="/assets/templates/board.html" class="square-button tile hoverCube" onclick="addActiveStyle(3)">
        <div class="frame">
          <div ><span id="tasksInProgressSummary" class="element">${progress.length}</span></div>
          <div class="tasks-on-board"><span>Task in<br />Progress</span></div>
        </div>
    </a>
      <a href="/assets/templates/board.html" class="square-button tile hoverCube" onclick="addActiveStyle(3)">
        <div class="frame">
          <div ><span id="taskAwaitingSummary" class="element">${feedback.length}</span></div>
          <div class="tasks-on-board"><span>Awaiting<br />Feedback</span></div>
        </div>
      </a>
  </div>`;
}