const defaultAccounts = [
  {
    id: 'alice',
    name: 'Alice',
    avatarText: 'A',
    theme: 'violet',
    status: '在线 · 正在创作',
    bio: '创意设计师，热爱极简和微交互。',
    chatBackground: 'aurora',
    backgroundUrl: '',
    moments: [
      { id: 1, text: '今天把界面改成了更像微信的三栏布局。', time: '09:30' },
      { id: 2, text: '灵感突然来了，想把双账号自聊做得更像真实社交。', time: '10:10' }
    ]
  },
  {
    id: 'bob',
    name: 'Bob',
    avatarText: 'B',
    theme: 'green',
    status: '在线 · 也在观察',
    bio: '产品经理，喜欢把复杂问题讲清楚。',
    chatBackground: 'sunset',
    backgroundUrl: '',
    moments: [
      { id: 3, text: '刚试了新的对话交互，感觉很有趣。', time: '09:45' }
    ]
  },
  {
    id: 'carol',
    name: 'Carol',
    avatarText: 'C',
    theme: 'orange',
    status: '在线 · 在看设计稿',
    bio: '视觉设计师，喜欢渐变和微动效。',
    chatBackground: 'night',
    backgroundUrl: '',
    moments: [
      { id: 4, text: '新的配色方案上线了，感觉更温暖。', time: '10:05' }
    ]
  },
  {
    id: 'dave',
    name: 'Dave',
    avatarText: 'D',
    theme: 'pink',
    status: '在线 · 代码敲不停',
    bio: '前端工程师，热爱组件化与交互体验。',
    chatBackground: 'grid',
    backgroundUrl: '',
    moments: [
      { id: 5, text: '实现了一个独立切换账号的聊天页面，体验很棒。', time: '10:20' }
    ]
  }
];

const initialMessages = [
  { id: 1, sender: 'alice', text: '欢迎来到双账号自聊站。现在你可以左右两边看到不同账号的信息。', time: '09:41' },
  { id: 2, sender: 'bob', text: '没错，聊天内容会在中间展示，而简介和朋友圈则分别在左右两边。', time: '09:42' }
];

let accounts = [];
let messages = [];
let messagesByPair = {};
let activeAccountId = 'alice';
let editingAccountId = null;
let selectedTheme = 'violet';
let selectedBackground = 'aurora';
let leftPanelAccountId = 'alice';
let rightPanelAccountId = 'bob';

function getThreadKey(a, b) {
  return [a, b].sort().join('|');
}

function setActiveThread() {
  const key = getThreadKey(leftPanelAccountId, rightPanelAccountId);
  messagesByPair[key] = messagesByPair[key] || [];
  messages = messagesByPair[key];
}

function loadState() {
  const savedAccounts = localStorage.getItem('dualChatAccounts');
  const savedMessages = localStorage.getItem('dualChatMessages');
  const savedActive = localStorage.getItem('dualChatActive');
  const savedLeft = localStorage.getItem('dualChatLeft');
  const savedRight = localStorage.getItem('dualChatRight');

  accounts = savedAccounts ? JSON.parse(savedAccounts) : JSON.parse(JSON.stringify(defaultAccounts));
  messagesByPair = savedMessages ? JSON.parse(savedMessages) : { [getThreadKey('alice', 'bob')]: [...initialMessages] };
  activeAccountId = savedActive || 'alice';
  leftPanelAccountId = savedLeft || 'alice';
  rightPanelAccountId = savedRight || 'bob';
  if (leftPanelAccountId === rightPanelAccountId) {
    rightPanelAccountId = accounts.find((account) => account.id !== leftPanelAccountId)?.id || rightPanelAccountId;
  }
  if (!accounts.some((account) => account.id === activeAccountId)) {
    activeAccountId = leftPanelAccountId;
  }
  setActiveThread();
}

function saveState() {
  messagesByPair[getThreadKey(leftPanelAccountId, rightPanelAccountId)] = messages;
  localStorage.setItem('dualChatAccounts', JSON.stringify(accounts));
  localStorage.setItem('dualChatMessages', JSON.stringify(messagesByPair));
  localStorage.setItem('dualChatActive', activeAccountId);
  localStorage.setItem('dualChatLeft', leftPanelAccountId);
  localStorage.setItem('dualChatRight', rightPanelAccountId);
}

function getAccount(id) {
  return accounts.find((account) => account.id === id) || accounts[0];
}

const roomTitle = document.getElementById('roomTitle');
const messageArea = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');
const messageFileInput = document.getElementById('messageFileInput');
const attachmentInfo = document.getElementById('attachmentInfo');
const composerForm = document.getElementById('composer');
const switchBtn = document.getElementById('switchBtn');
const resetBtn = document.getElementById('resetBtn');
const themeBtn = document.getElementById('themeBtn');
const currentSender = document.getElementById('currentSender');
const chatPanel = document.querySelector('.chat-panel');
const editModal = document.getElementById('editModal');
const modalTitle = document.getElementById('modalTitle');
const editName = document.getElementById('editName');
const editAvatarText = document.getElementById('editAvatarText');
const editAvatarImage = document.getElementById('editAvatarImage');
const editBio = document.getElementById('editBio');
const editBackgroundUrl = document.getElementById('editBackgroundUrl');
const editBackgroundFile = document.getElementById('editBackgroundFile');
const saveEditBtn = document.getElementById('saveEdit');
const cancelEditBtn = document.getElementById('cancelEdit');
const editButtons = document.querySelectorAll('[data-edit]');
const closeButtons = document.querySelectorAll('.close-panel');
const leftPanel = document.getElementById('leftPanel');
const rightPanel = document.getElementById('rightPanel');
const leftSwitchAccountBtn = document.getElementById('leftSwitchAccountBtn');
const rightSwitchAccountBtn = document.getElementById('rightSwitchAccountBtn');
const leftAccountSelect = document.getElementById('leftAccountSelect');
const rightAccountSelect = document.getElementById('rightAccountSelect');
const panelAvatarLeft = document.getElementById('panelAvatarLeft');
const panelNameLeft = document.getElementById('panelNameLeft');
const panelStatusLeft = document.getElementById('panelStatusLeft');
const panelBioLeft = document.getElementById('panelBioLeft');
const panelMomentsLeft = document.getElementById('panelMomentsLeft');
const leftMomentForm = document.getElementById('leftMomentForm');
const leftEditBtn = document.getElementById('leftEditBtn');
const panelAvatarRight = document.getElementById('panelAvatarRight');
const panelNameRight = document.getElementById('panelNameRight');
const panelStatusRight = document.getElementById('panelStatusRight');
const panelBioRight = document.getElementById('panelBioRight');
const panelMomentsRight = document.getElementById('panelMomentsRight');
const rightMomentForm = document.getElementById('rightMomentForm');
const rightEditBtn = document.getElementById('rightEditBtn');
const momentForms = document.querySelectorAll('.moment-form');

function openPanel(id) {
  if (leftPanelAccountId === id) {
    leftPanel.classList.remove('hidden');
    rightPanel.classList.add('hidden');
    return;
  }

  if (rightPanelAccountId === id) {
    rightPanel.classList.remove('hidden');
    leftPanel.classList.add('hidden');
    return;
  }

  leftPanelAccountId = id;
  renderPanels();
  leftPanel.classList.remove('hidden');
  rightPanel.classList.add('hidden');
}

function closePanel(id) {
  if (id === 'left') {
    leftPanel.classList.add('hidden');
  } else {
    rightPanel.classList.add('hidden');
  }
}

function renderMedia(media, className = 'moment-media') {
  if (!media) return null;
  const container = document.createElement('div');
  container.className = className;

  if (media.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = media.url;
    img.alt = '图片内容';
    container.appendChild(img);
  } else if (media.type.startsWith('video/')) {
    const video = document.createElement('video');
    video.src = media.url;
    video.controls = true;
    container.appendChild(video);
  }

  return container;
}

function populateAccountSelectors() {
  const options = accounts.map((account) => `<option value="${account.id}">${account.name}</option>`).join('');
  leftAccountSelect.innerHTML = options;
  rightAccountSelect.innerHTML = options;
}

function renderSelectorState() {
  leftAccountSelect.value = leftPanelAccountId;
  rightAccountSelect.value = rightPanelAccountId;
  accounts.forEach((account) => {
    const leftOption = leftAccountSelect.querySelector(`option[value="${account.id}"]`);
    const rightOption = rightAccountSelect.querySelector(`option[value="${account.id}"]`);
    if (leftOption) leftOption.disabled = account.id === rightPanelAccountId;
    if (rightOption) rightOption.disabled = account.id === leftPanelAccountId;
  });
}

function renderPanel(side) {
  const accountId = side === 'left' ? leftPanelAccountId : rightPanelAccountId;
  const account = getAccount(accountId);
  const avatar = side === 'left' ? panelAvatarLeft : panelAvatarRight;
  const name = side === 'left' ? panelNameLeft : panelNameRight;
  const status = side === 'left' ? panelStatusLeft : panelStatusRight;
  const bio = side === 'left' ? panelBioLeft : panelBioRight;
  const momentsContainer = side === 'left' ? panelMomentsLeft : panelMomentsRight;
  const momentForm = side === 'left' ? leftMomentForm : rightMomentForm;
  const editBtn = side === 'left' ? leftEditBtn : rightEditBtn;
  const switchBtn = side === 'left' ? leftSwitchAccountBtn : rightSwitchAccountBtn;

  avatar.className = `avatar avatar-${account.theme}`;
  if (account.avatarUrl) {
    avatar.style.backgroundImage = `url('${account.avatarUrl}')`;
    avatar.style.backgroundSize = 'cover';
    avatar.style.backgroundPosition = 'center';
    avatar.textContent = '';
  } else {
    avatar.style.backgroundImage = '';
    avatar.textContent = account.avatarText;
  }

  name.textContent = account.name;
  status.textContent = account.status;
  bio.textContent = account.bio;
  editBtn.dataset.edit = accountId;
  momentForm.dataset.account = accountId;
  switchBtn.textContent = accountId === 'alice' ? '切换到 Bob' : '切换到 Alice';

  momentsContainer.innerHTML = '';
  account.moments.slice().reverse().forEach((moment) => {
    const item = document.createElement('div');
    item.className = 'moment-item';
    if (moment.text) {
      const textBlock = document.createElement('div');
      textBlock.textContent = moment.text;
      item.appendChild(textBlock);
    }
    const mediaElement = renderMedia(moment.media, 'moment-media');
    if (mediaElement) {
      item.appendChild(mediaElement);
    }
    const actionBar = document.createElement('div');
    actionBar.className = 'moment-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'moment-action-btn';
    editBtn.textContent = '编辑';
    editBtn.addEventListener('click', () => editMoment(account.id, moment.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'moment-action-btn';
    deleteBtn.textContent = '删除';
    deleteBtn.addEventListener('click', () => deleteMoment(account.id, moment.id));

    actionBar.append(editBtn, deleteBtn);
    item.appendChild(actionBar);

    const time = document.createElement('span');
    time.className = 'moment-time';
    time.textContent = moment.time;
    item.appendChild(time);
    momentsContainer.appendChild(item);
  });
}

function renderPanels() {
  setActiveThread();
  populateAccountSelectors();
  renderSelectorState();
  renderPanel('left');
  renderPanel('right');
  renderMessages();
}

function applyChatBackground() {
  const account = getAccount(activeAccountId);
  const bgMap = {
    aurora: 'linear-gradient(135deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.78))',
    sunset: 'linear-gradient(135deg, rgba(88, 28, 135, 0.9), rgba(249, 115, 22, 0.7))',
    night: 'linear-gradient(135deg, rgba(2, 6, 23, 0.98), rgba(15, 23, 42, 0.9))',
    grid: 'linear-gradient(135deg, rgba(3, 7, 18, 0.95), rgba(8, 47, 73, 0.9))'
  };

  if (account.backgroundUrl) {
    chatPanel.style.background = `linear-gradient(135deg, rgba(2, 6, 23, 0.7), rgba(15, 23, 42, 0.78)), url('${account.backgroundUrl}') center/cover`;
  } else {
    chatPanel.style.background = bgMap[account.chatBackground] || bgMap.aurora;
  }
}

function renderMessages() {
  messageArea.innerHTML = '';

  messages.forEach((message) => {
    const account = getAccount(message.sender);
    const row = document.createElement('div');
    const senderSide = message.sender === leftPanelAccountId ? 'left' : 'right';
    row.className = `message-row ${senderSide}`;

    const avatar = document.createElement('div');
    avatar.className = `sender-avatar avatar-${account.theme}`;
    if (account.avatarUrl) {
      avatar.style.backgroundImage = `url('${account.avatarUrl}')`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';
      avatar.textContent = '';
    } else {
      avatar.textContent = account.avatarText;
    }
    avatar.addEventListener('click', () => openPanel(account.id));

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.innerHTML = `<span>${account.name}</span><span>${message.time}</span>`;

    const text = document.createElement('div');
    text.textContent = message.text;

    bubble.append(meta);
    if (message.text) {
      bubble.append(text);
    }
    const actionBar = document.createElement('div');
    actionBar.className = 'message-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'message-action-btn';
    editBtn.textContent = '编辑';
    editBtn.addEventListener('click', () => editMessage(message.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'message-action-btn';
    deleteBtn.textContent = '删除';
    deleteBtn.addEventListener('click', () => deleteMessage(message.id));

    actionBar.append(editBtn, deleteBtn);

    if (message.text) {
      bubble.append(text);
    }
    bubble.appendChild(actionBar);
    const mediaElement = renderMedia(message.media);
    if (mediaElement) {
      bubble.appendChild(mediaElement);
    }

    if (senderSide === 'left') {
      row.append(avatar, bubble);
    } else {
      row.append(bubble, avatar);
    }
    messageArea.appendChild(row);
  });

  messageArea.scrollTop = messageArea.scrollHeight;
}

function updateHeader() {
  const left = getAccount(leftPanelAccountId);
  const right = getAccount(rightPanelAccountId);
  roomTitle.textContent = `${left.name} 与 ${right.name} 的对话`;
  if (![leftPanelAccountId, rightPanelAccountId].includes(activeAccountId)) {
    activeAccountId = leftPanelAccountId;
  }
  currentSender.textContent = getAccount(activeAccountId).name;
}

function editMoment(accountId, momentId) {
  const account = getAccount(accountId);
  const moment = account.moments.find((item) => item.id === momentId);
  if (!moment) return;
  const updatedText = prompt('编辑朋友圈内容：', moment.text || '');
  if (updatedText === null) return;
  moment.text = updatedText.trim();
  saveState();
  renderPanels();
}

function deleteMoment(accountId, momentId) {
  const account = getAccount(accountId);
  account.moments = account.moments.filter((item) => item.id !== momentId);
  saveState();
  renderPanels();
}

function editMessage(messageId) {
  const message = messages.find((item) => item.id === messageId);
  if (!message) return;
  const updatedText = prompt('编辑消息内容：', message.text || '');
  if (updatedText === null) return;
  message.text = updatedText.trim();
  saveState();
  renderMessages();
}

function deleteMessage(messageId) {
  messages = messages.filter((item) => item.id !== messageId);
  saveState();
  renderMessages();
}

function addMessage(text, media = null) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  messages.push({ id: Date.now(), sender: activeAccountId, text, media, time });
  saveState();
  renderMessages();
}

function createMediaObject(file, callback) {
  const reader = new FileReader();
  reader.onload = () => {
    callback({ url: reader.result, type: file.type });
  };
  reader.readAsDataURL(file);
}

function openEditor(accountId) {
  editingAccountId = accountId;
  const account = getAccount(accountId);
  modalTitle.textContent = `编辑 ${account.name}`;
  editName.value = account.name;
  editAvatarText.value = account.avatarText;
  editBio.value = account.bio;
  editBackgroundUrl.value = account.backgroundUrl;
  editBackgroundFile.value = '';
  editAvatarImage.value = '';
  selectedTheme = account.theme;
  selectedBackground = account.chatBackground;

  document.querySelectorAll('.color-option').forEach((option) => {
    option.classList.toggle('active', option.dataset.theme === selectedTheme);
  });
  document.querySelectorAll('.bg-option').forEach((option) => {
    option.classList.toggle('active', option.dataset.bg === selectedBackground);
  });

  editModal.classList.add('show');
}

function closeEditor() {
  editModal.classList.remove('show');
  editingAccountId = null;
}

function saveEditor() {
  if (!editingAccountId) return;
  const account = getAccount(editingAccountId);
  account.name = editName.value.trim() || account.name;
  account.avatarText = editAvatarText.value.trim().slice(0, 2) || account.avatarText;
  account.theme = selectedTheme;
  account.bio = editBio.value.trim() || account.bio;
  account.chatBackground = selectedBackground;
  account.backgroundUrl = editBackgroundUrl.value.trim();

  const avatarFile = editAvatarImage.files[0];
  const backgroundFile = editBackgroundFile.files[0];

  function finalize() {
    saveState();
    renderPanels();
    applyChatBackground();
    updateHeader();
    closeEditor();
  }

  if (avatarFile) {
    createMediaObject(avatarFile, (media) => {
      account.avatarUrl = media.url;
      if (backgroundFile) {
        createMediaObject(backgroundFile, (bgMedia) => {
          account.backgroundUrl = bgMedia.url;
          finalize();
        });
      } else {
        finalize();
      }
    });
  } else if (backgroundFile) {
    createMediaObject(backgroundFile, (bgMedia) => {
      account.backgroundUrl = bgMedia.url;
      finalize();
    });
  } else {
    finalize();
  }
}

editButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openEditor(button.dataset.edit);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    closePanel(button.dataset.close);
  });
});

leftAccountSelect.addEventListener('change', () => {
  leftPanelAccountId = leftAccountSelect.value;
  if (leftPanelAccountId === rightPanelAccountId) {
    rightPanelAccountId = accounts.find((account) => account.id !== leftPanelAccountId)?.id || rightPanelAccountId;
  }
  if (! [leftPanelAccountId, rightPanelAccountId].includes(activeAccountId)) {
    activeAccountId = leftPanelAccountId;
  }
  renderPanels();
  updateHeader();
  saveState();
});

rightAccountSelect.addEventListener('change', () => {
  rightPanelAccountId = rightAccountSelect.value;
  if (rightPanelAccountId === leftPanelAccountId) {
    leftPanelAccountId = accounts.find((account) => account.id !== rightPanelAccountId)?.id || leftPanelAccountId;
  }
  if (! [leftPanelAccountId, rightPanelAccountId].includes(activeAccountId)) {
    activeAccountId = rightPanelAccountId;
  }
  renderPanels();
  updateHeader();
  saveState();
});

leftSwitchAccountBtn.addEventListener('click', () => {
  const next = accounts.find((account) => account.id !== leftPanelAccountId && account.id !== rightPanelAccountId) || accounts.find((account) => account.id !== leftPanelAccountId);
  if (next) {
    leftPanelAccountId = next.id;
    if (leftPanelAccountId === rightPanelAccountId) {
      rightPanelAccountId = accounts.find((account) => account.id !== leftPanelAccountId)?.id || rightPanelAccountId;
    }
    renderPanels();
    updateHeader();
    saveState();
  }
});

rightSwitchAccountBtn.addEventListener('click', () => {
  const next = accounts.find((account) => account.id !== rightPanelAccountId && account.id !== leftPanelAccountId) || accounts.find((account) => account.id !== rightPanelAccountId);
  if (next) {
    rightPanelAccountId = next.id;
    if (rightPanelAccountId === leftPanelAccountId) {
      leftPanelAccountId = accounts.find((account) => account.id !== rightPanelAccountId)?.id || leftPanelAccountId;
    }
    renderPanels();
    updateHeader();
    saveState();
  }
});

momentForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const textarea = form.querySelector('textarea');
    const fileInput = form.querySelector('.moment-file-input');
    const text = textarea.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) return;

    const account = getAccount(form.dataset.account);

    function saveMoment(media = null) {
      account.moments.push({
        id: Date.now(),
        text,
        media,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      });
      textarea.value = '';
      fileInput.value = '';
      saveState();
      renderPanels();
    }

    if (file) {
      createMediaObject(file, saveMoment);
    } else {
      saveMoment();
    }
  });
});

saveEditBtn.addEventListener('click', saveEditor);
cancelEditBtn.addEventListener('click', closeEditor);
editModal.addEventListener('click', (event) => {
  if (event.target === editModal) closeEditor();
});

document.querySelectorAll('.color-option').forEach((option) => {
  option.addEventListener('click', () => {
    selectedTheme = option.dataset.theme;
    document.querySelectorAll('.color-option').forEach((item) => {
      item.classList.toggle('active', item === option);
    });
  });
});

document.querySelectorAll('.bg-option').forEach((option) => {
  option.addEventListener('click', () => {
    selectedBackground = option.dataset.bg;
    document.querySelectorAll('.bg-option').forEach((item) => {
      item.classList.toggle('active', item === option);
    });
  });
});

switchBtn.addEventListener('click', () => {
  const participants = [leftPanelAccountId, rightPanelAccountId];
  if (participants[0] === participants[1]) return;
  if (!participants.includes(activeAccountId)) {
    activeAccountId = leftPanelAccountId;
  } else {
    activeAccountId = activeAccountId === participants[0] ? participants[1] : participants[0];
  }
  saveState();
  updateHeader();
  applyChatBackground();
});

themeBtn.addEventListener('click', () => {
  const backgrounds = ['aurora', 'sunset', 'night', 'grid'];
  const account = getAccount(activeAccountId);
  const currentIndex = backgrounds.indexOf(account.chatBackground);
  account.chatBackground = backgrounds[(currentIndex + 1) % backgrounds.length];
  saveState();
  applyChatBackground();
});

resetBtn.addEventListener('click', () => {
  messages = [...initialMessages];
  saveState();
  renderMessages();
});

composerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  const file = messageFileInput.files[0];

  if (!text && !file) return;

  if (file) {
    createMediaObject(file, (media) => {
      addMessage(text, media);
      messageInput.value = '';
      messageFileInput.value = '';
      attachmentInfo.textContent = '未选择文件';
    });
  } else {
    addMessage(text);
    messageInput.value = '';
  }
});

messageFileInput.addEventListener('change', () => {
  const file = messageFileInput.files[0];
  attachmentInfo.textContent = file ? `${file.name} 已选择` : '未选择文件';
});

loadState();
renderPanels();
applyChatBackground();
updateHeader();
renderMessages();
