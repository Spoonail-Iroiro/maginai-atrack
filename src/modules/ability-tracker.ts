import maginai from 'maginai';
import * as util from './util.js';
import { AbilityTrackerView } from './ability-tracker-view.js';

export class AbilityTracker {
  private showingAbilities: (string | null)[];
  private view: AbilityTrackerView;
  private previousViewSkillWindowChara: { id: string } | null;
  constructor() {
    this.showingAbilities = [null, null, null];
    this.view = new AbilityTrackerView();
    this.previousViewSkillWindowChara = null;
  }

  init() {
    const self = this;
    this.view.init();

    // Update UI when add/loseExp on skills
    maginai.patcher.patchMethod(tGameCharactor, 'addExp', (origMethod) => {
      const rtnFn = function (this: tGameCharactor, ...args: any[]) {
        origMethod.call(this, ...args);
        util.safe(() => self.update());
      };
      return rtnFn;
    });
    maginai.patcher.patchMethod(tGameCharactor, 'loseExp', (origMethod) => {
      const rtnFn = function (this: tGameCharactor, ...args: any[]) {
        origMethod.call(this, ...args);
        util.safe(() => self.update());
      };
      return rtnFn;
    });

    // Insert custom update method in ability window update
    // To accept set ability from the window through shortcut 1...n
    maginai.patcher.patchMethod(
      tGameSkillWindow,
      'setFrameEvent_frame',
      (origMethod) => {
        const rtnFn = function (this: tGameSkillWindow, ...args: any[]) {
          origMethod.call(this, ...args);
          util.safe(() => self.abilityWindowUpdate());
        };
        return rtnFn;
      }
    );

    // Save a.chara passed to viewSkillWindow because tGameSkillWindow doesn't keep it.
    maginai.patcher.patchMethod(
      tGameSkillWindow,
      'viewSkillWindow',
      (origMethod) => {
        const rtnFn = function (
          this: tGameSkillWindow,
          a: { chara: { id: string } },
          ...args: any[]
        ) {
          origMethod.call(this, a, ...args);
          self.previousViewSkillWindowChara = a.chara;
        };
        return rtnFn;
      }
    );

    const sv = maginai.modSave;

    maginai.events.saveLoaded.addHandler(() => {
      const saveObj = sv.getSaveObject('atrack') ?? this.getInitialSaveObject();
      this.importSaveObject(saveObj);
      this.update();
    });

    maginai.events.saveObjectRequired.addHandler(() => {
      const saveObj = this.exportSaveObject();
      sv.setSaveObject('atrack', saveObj);
    });
  }

  private getInitialSaveObject() {
    return { showingAbilities: [null, null, null] };
  }

  private exportSaveObject() {
    return { showingAbilities: this.showingAbilities };
  }

  private importSaveObject(obj: { showingAbilities: (string | null)[] }) {
    this.showingAbilities = obj.showingAbilities;
  }

  private abilityWindowUpdate() {
    const kbd = tWgm.tGameKeyboard;
    const awin = tWgm.tGameSkillWindow;
    if (
      this.previousViewSkillWindowChara !== null &&
      this.previousViewSkillWindowChara['id'] === 'player'
    ) {
      for (let i = 0; i < 3; ++i) {
        if (kbd.isClick('shortcut' + (i + 1))) {
          kbd.clearPressKeys();
          const idx =
            awin.viewData.nowPage * awin.viewSkillMaxNum +
            awin.viewData.cursorIdx;
          const skill = awin.viewData.skills[idx];
          this.showAbilityLevel(skill[0], i);
          tWgm.tGameSoundResource.play('select', undefined);
        }
      }
    }
  }

  private update() {
    // Update
    const rows = this.showingAbilities.map((sid: string | null) => {
      if (sid === null) {
        return '\n\n';
      }
      const skillData = tWgm.tGameSkill.skillData[sid];
      if (skillData === undefined) {
        return '%c[nowtime]不明なアビリティ\n\n';
      }
      const player = tWgm.tGameCharactor.charas.player;
      const exp = player.skills[sid] !== undefined ? player.skills[sid][0] : 0;
      return `%c[nowtime]${skillData[0]}\nLv${Math.floor(
        exp / 100000
      )}\u3000${Math.floor((exp % 100000) / 1000)}%\n`;
    });
    const text = rows.join('\n');
    this.view.setText(text);
  }

  showAbilityLevel(skillId: string, index: number = 0) {
    // Add skill to showing list
    if (index >= this.showingAbilities.length) {
      throw new Error('limit of # of abilities to show');
    }
    this.showingAbilities[index] = skillId;
    this.update();
  }

  // update() {
  //   this.count += 1;
  //   this.view.setText('%c[nowtime]' + this.count.toString() + '\ncount');
  // }
}
