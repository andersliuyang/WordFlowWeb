// 本文件由 tools/generate-levels.mjs 自动生成，请勿手改。
// 语言：zh-CN / en-US

export const LEVELS = [
  {
    "id": "wf_zh_001",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "tutorial",
    "grid_dim": {
      "x": 3,
      "y": 3
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 70,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "二",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "清",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "明",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "木",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "虫",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "水",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "山",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "山水",
        "hint_text": "山与水的合称",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "明月",
        "hint_text": "明亮的月亮",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "清风"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "山水",
        "path": [
          [
            2,
            2
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w2",
        "text": "明月",
        "path": [
          [
            0,
            1
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_002",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "tutorial",
    "grid_dim": {
      "x": 3,
      "y": 3
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 70,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "意",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "明",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "河",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "草",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "春",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "春风",
        "hint_text": "春天的风",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "江河",
        "hint_text": "江与河",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "明月"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "春风",
        "path": [
          [
            2,
            2
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w2",
        "text": "江河",
        "path": [
          [
            0,
            1
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_003",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "tutorial",
    "grid_dim": {
      "x": 3,
      "y": 3
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 85,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "火",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "花",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "林",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "草",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "森",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "雨",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "秋",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "花草",
        "hint_text": "花与草",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "森林",
        "hint_text": "成片的树木",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "云海",
        "hint_text": "像海一样的云",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "秋雨"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "花草",
        "path": [
          [
            1,
            0
          ],
          [
            1,
            1
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w2",
        "text": "森林",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            0
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w3",
        "text": "云海",
        "path": [
          [
            0,
            2
          ],
          [
            0,
            1
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_004",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "easy",
    "grid_dim": {
      "x": 4,
      "y": 4
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 85,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "厚",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "星",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "暖",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "日",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "光",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "土",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "明",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "心",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "川",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "花",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "月",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "日月",
        "hint_text": "太阳与月亮",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "山川",
        "hint_text": "山与河流",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "星光",
        "hint_text": "星星的光",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "云海",
      "花月"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "日月",
        "path": [
          [
            1,
            1
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "山川",
            "path": [
              [
                1,
                2
              ],
              [
                1,
                3
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "星光",
        "path": [
          [
            3,
            0
          ],
          [
            2,
            1
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_005",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "easy",
    "grid_dim": {
      "x": 4,
      "y": 4
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "心",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "夏",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "夜",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "绿",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "白",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "光",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "青",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "河",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "阳",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "雨",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "虫",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "水",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "青山",
        "hint_text": "青翠的山",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "绿水",
        "hint_text": "碧绿的水",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "白云",
        "hint_text": "白色的云",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "夏雨",
        "hint_text": "夏天的雨",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "阳光",
      "江河"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "青山",
        "path": [
          [
            3,
            1
          ],
          [
            3,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "绿水",
            "path": [
              [
                3,
                2
              ],
              [
                3,
                3
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "白云",
        "path": [
          [
            1,
            1
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "夏雨",
            "path": [
              [
                1,
                2
              ],
              [
                1,
                3
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_006",
    "language": "zh-CN",
    "theme": "四季",
    "tier": "easy",
    "grid_dim": {
      "x": 4,
      "y": 4
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "田",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "地",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "日",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "冬",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "雨",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "秋",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "高",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "夏",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "厚",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "虫",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "雪",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "秋月",
        "hint_text": "秋天的月",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "冬雪",
        "hint_text": "冬天的雪",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "天高",
        "hint_text": "天空高远",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "地厚",
        "hint_text": "大地深厚",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "夏雨",
      "春风"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "秋月",
        "path": [
          [
            3,
            1
          ],
          [
            3,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "冬雪",
            "path": [
              [
                3,
                2
              ],
              [
                3,
                3
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "天高",
        "path": [
          [
            1,
            1
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "地厚",
            "path": [
              [
                1,
                2
              ],
              [
                1,
                3
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_007",
    "language": "zh-CN",
    "theme": "胸怀",
    "tier": "medium",
    "grid_dim": {
      "x": 5,
      "y": 5
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "木",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "光",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "石",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "林",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "虫",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "冬",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "秋",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "明",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "秀",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "心",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "花",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "水",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "明",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "华",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "阔",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "飞",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "实",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "空",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "云",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "海阔",
        "hint_text": "大海辽阔",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "天空",
        "hint_text": "高高的天",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "春华",
        "hint_text": "春天的花朵",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "秋实",
        "hint_text": "秋天的果实",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "花明",
        "hint_text": "花光明媚",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "水秀",
      "山明"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "海阔",
        "path": [
          [
            3,
            2
          ],
          [
            3,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w2",
            "text": "天空",
            "path": [
              [
                3,
                3
              ],
              [
                3,
                4
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "春华",
        "path": [
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w4",
            "text": "秋实",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w5",
        "text": "花明",
        "path": [
          [
            4,
            2
          ],
          [
            4,
            1
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_008",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "medium",
    "grid_dim": {
      "x": 5,
      "y": 5
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "雨",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "日",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "鱼",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "石",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "香",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "心",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "水",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "柳",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "花",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "清",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "秀",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "暗",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "河",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "明",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "飞",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "语",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "明",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "天",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "柳暗",
        "hint_text": "柳色深暗",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "山明",
        "hint_text": "山水明秀",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "水秀",
        "hint_text": "水色秀丽",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "鸟语",
        "hint_text": "鸟儿的鸣叫",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "花香",
        "hint_text": "花朵的芬芳",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "清风",
      "明月"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "柳暗",
        "path": [
          [
            3,
            2
          ],
          [
            3,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w2",
            "text": "山明",
            "path": [
              [
                3,
                3
              ],
              [
                3,
                4
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "水秀",
        "path": [
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w4",
            "text": "鸟语",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w5",
        "text": "花香",
        "path": [
          [
            4,
            2
          ],
          [
            4,
            1
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_009",
    "language": "zh-CN",
    "theme": "四季",
    "tier": "hard",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "清",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "厚",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "虫",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "水",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "秋",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "星",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "阔",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "心",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "远",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "夏",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "飞",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "石",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "语",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "林",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "阔",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "秀",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "林",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "冬",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "心",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "川",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "雪",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "雨",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "一",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "光",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "星",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "河",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "高",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "春风",
        "hint_text": "春天的风",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "夏雨",
        "hint_text": "夏天的雨",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "秋月",
        "hint_text": "秋天的月",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "冬雪",
        "hint_text": "冬天的雪",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "江河",
        "hint_text": "江与河",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "星光",
      "山川"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "春风",
        "path": [
          [
            4,
            2
          ],
          [
            4,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "夏雨",
            "path": [
              [
                4,
                3
              ],
              [
                4,
                4
              ]
            ]
          },
          {
            "word_id": "w3",
            "text": "秋月",
            "path": [
              [
                4,
                4
              ],
              [
                4,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w4",
        "text": "冬雪",
        "path": [
          [
            2,
            3
          ],
          [
            2,
            4
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w5",
            "text": "江河",
            "path": [
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_010",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "hard",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "秀",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "意",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "日",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "石",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "厚",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "长",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "土",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "香",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "星",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "木",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "森",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "阔",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "秀",
        "type": "ice",
        "hp": 2
      },
      {
        "x": 1,
        "y": 3,
        "char": "木",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "火",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "林",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "光",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "阳",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "川",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "二",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "花",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "光",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "远",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "森林",
        "hint_text": "成片的树木",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "云海",
        "hint_text": "像海一样的云",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "日月",
        "hint_text": "太阳与月亮",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "山川",
        "hint_text": "山与河流",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "星光",
        "hint_text": "星星的光",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "花海",
      "阳光"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "森林",
        "path": [
          [
            4,
            2
          ],
          [
            4,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "云海",
            "path": [
              [
                4,
                3
              ],
              [
                4,
                4
              ]
            ]
          },
          {
            "word_id": "w3",
            "text": "日月",
            "path": [
              [
                4,
                4
              ],
              [
                4,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w4",
        "text": "山川",
        "path": [
          [
            2,
            3
          ],
          [
            2,
            4
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w5",
            "text": "星光",
            "path": [
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_011",
    "language": "zh-CN",
    "theme": "自然",
    "tier": "hard",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "秀",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "意",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "河",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "木",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "白",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "石",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "厚",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "冬",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "长",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "绿",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "田",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "香",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "森",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "青",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "厚",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "秀",
        "type": "lock",
        "lockKey": null,
        "locked": true
      },
      {
        "x": 1,
        "y": 3,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "花",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "石",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "秋",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "月",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "秋",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "草",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "海",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "水",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "二",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "水",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "流",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "林",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "云",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "远",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "青山",
        "hint_text": "青翠的山",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "绿水",
        "hint_text": "碧绿的水",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "白云",
        "hint_text": "白色的云",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "花草",
        "hint_text": "花与草",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "森林",
        "hint_text": "成片的树木",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "流水",
      "秋月"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "青山",
        "path": [
          [
            4,
            2
          ],
          [
            4,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "绿水",
            "path": [
              [
                4,
                3
              ],
              [
                4,
                4
              ]
            ]
          },
          {
            "word_id": "w3",
            "text": "白云",
            "path": [
              [
                4,
                4
              ],
              [
                4,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w4",
        "text": "花草",
        "path": [
          [
            2,
            3
          ],
          [
            2,
            4
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w5",
            "text": "森林",
            "path": [
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_zh_012",
    "language": "zh-CN",
    "theme": "四季",
    "tier": "hard",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "开",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "花",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "地",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "金",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "二",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "火",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "明",
        "type": "lock",
        "lockKey": null,
        "locked": true
      },
      {
        "x": 1,
        "y": 1,
        "char": "清",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "江",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "草",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "山",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "星",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "冬",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "木",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "暖",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "天",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "语",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "草",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "雪",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "鱼",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "人",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "海",
        "type": "ice",
        "hp": 2
      },
      {
        "x": 0,
        "y": 4,
        "char": "春",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "心",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "高",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "清",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "阔",
        "type": "bomb",
        "countdown": 9
      },
      {
        "x": 0,
        "y": 5,
        "char": "田",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "鸟",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "厚",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "藏",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "风",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "空",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "冬雪",
        "hint_text": "冬天的雪",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "天高",
        "hint_text": "天空高远",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "地厚",
        "hint_text": "大地深厚",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "海阔",
        "hint_text": "大海辽阔",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "天空",
        "hint_text": "高高的天",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "花开",
      "春暖"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "冬雪",
        "path": [
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "天高",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ]
            ]
          },
          {
            "word_id": "w3",
            "text": "地厚",
            "path": [
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w4",
        "text": "海阔",
        "path": [
          [
            5,
            3
          ],
          [
            5,
            4
          ]
        ],
        "cracked": true,
        "triggers_gravity": false,
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w4",
        "text": "海阔",
        "path": [
          [
            5,
            3
          ],
          [
            5,
            4
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w5",
            "text": "天空",
            "path": [
              [
                5,
                4
              ],
              [
                5,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_001",
    "language": "en-US",
    "theme": "Animals",
    "tier": "tutorial",
    "grid_dim": {
      "x": 3,
      "y": 3
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 70,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "C",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "CAT",
        "hint_text": "A small furry pet",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "DOG",
        "hint_text": "A loyal pet",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "ARM"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "CAT",
        "path": [
          [
            2,
            2
          ],
          [
            1,
            2
          ],
          [
            0,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w2",
        "text": "DOG",
        "path": [
          [
            0,
            2
          ],
          [
            1,
            2
          ],
          [
            2,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_002",
    "language": "en-US",
    "theme": "Sky",
    "tier": "tutorial",
    "grid_dim": {
      "x": 3,
      "y": 3
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 70,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "Y",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "S",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "SUN",
        "hint_text": "The star we orbit",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "SKY",
        "hint_text": "The space above us",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "FOX"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "SUN",
        "path": [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            0,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w2",
        "text": "SKY",
        "path": [
          [
            2,
            2
          ],
          [
            1,
            2
          ],
          [
            2,
            1
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_003",
    "language": "en-US",
    "theme": "Animals",
    "tier": "tutorial",
    "grid_dim": {
      "x": 3,
      "y": 3
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 85,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "E",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "SEA",
        "hint_text": "The ocean",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "ICE",
        "hint_text": "Frozen water",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "FOX",
        "hint_text": "A wild canine",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "SEA",
        "path": [
          [
            1,
            0
          ],
          [
            1,
            1
          ],
          [
            1,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w2",
        "text": "ICE",
        "path": [
          [
            2,
            0
          ],
          [
            2,
            1
          ],
          [
            2,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [],
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w3",
        "text": "FOX",
        "path": [
          [
            0,
            2
          ],
          [
            0,
            1
          ],
          [
            0,
            0
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_004",
    "language": "en-US",
    "theme": "Animals",
    "tier": "easy",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "L",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "P",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "CAT",
        "hint_text": "A small furry pet",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "DOG",
        "hint_text": "A loyal pet",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "FOX",
        "hint_text": "A wild canine",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "OWL",
        "hint_text": "A night bird",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "BAT",
      "EGG"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "CAT",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w2",
            "text": "DOG",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ],
              [
                1,
                4
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "FOX",
        "path": [
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "OWL",
            "path": [
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                0,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_005",
    "language": "en-US",
    "theme": "Animals",
    "tier": "easy",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "L",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "Y",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "L",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "BAT",
        "hint_text": "A flying mammal",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "EGG",
        "hint_text": "Laid by birds",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "BEE",
        "hint_text": "A buzzing insect",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "COW",
        "hint_text": "A farm animal",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "FOX",
      "ARM"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "BAT",
        "path": [
          [
            4,
            1
          ],
          [
            4,
            2
          ],
          [
            4,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "EGG",
            "path": [
              [
                4,
                3
              ],
              [
                4,
                4
              ],
              [
                4,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "BEE",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "COW",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_006",
    "language": "en-US",
    "theme": "Nature",
    "tier": "easy",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "Z",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "H",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "L",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "L",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "Y",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "L",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "E",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "ARM",
        "hint_text": "Part of the body",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "ART",
        "hint_text": "Creative work",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "SEA",
        "hint_text": "The ocean",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "ICE",
        "hint_text": "Frozen water",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "POT",
      "SUN"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "ARM",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "ART",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "SEA",
        "path": [
          [
            5,
            1
          ],
          [
            5,
            2
          ],
          [
            5,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "ICE",
            "path": [
              [
                5,
                3
              ],
              [
                5,
                4
              ],
              [
                5,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_007",
    "language": "en-US",
    "theme": "Objects",
    "tier": "medium",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "H",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "M",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "FAN",
        "hint_text": "Moves air",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "HAT",
        "hint_text": "Worn on the head",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "RUG",
        "hint_text": "A floor cover",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "JAM",
        "hint_text": "Fruit spread",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "MUD",
        "hint_text": "Wet soil",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "SUN",
      "BAG"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "FAN",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [
          {
            "word_id": "w2",
            "text": "HAT",
            "path": [
              [
                2,
                3
              ],
              [
                1,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "RUG",
        "path": [
          [
            0,
            1
          ],
          [
            0,
            2
          ],
          [
            0,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "JAM",
            "path": [
              [
                0,
                3
              ],
              [
                0,
                4
              ],
              [
                0,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w5",
        "text": "MUD",
        "path": [
          [
            5,
            5
          ],
          [
            5,
            4
          ],
          [
            5,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_008",
    "language": "en-US",
    "theme": "Sky",
    "tier": "medium",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 115,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "Q",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "Q",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "H",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "Y",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "F",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "SUN",
        "hint_text": "The star we orbit",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "SKY",
        "hint_text": "The space above us",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "MUD",
        "hint_text": "Wet soil",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "POT",
        "hint_text": "A container",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w5",
        "text": "ARM",
        "hint_text": "Part of the body",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "ART",
      "HAT"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "SUN",
        "path": [
          [
            4,
            1
          ],
          [
            4,
            2
          ],
          [
            4,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "SKY",
            "path": [
              [
                4,
                3
              ],
              [
                4,
                4
              ],
              [
                4,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "MUD",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "POT",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w5",
        "text": "ARM",
        "path": [
          [
            0,
            4
          ],
          [
            0,
            3
          ],
          [
            0,
            2
          ]
        ],
        "cracked": false,
        "triggers_gravity": true,
        "cascades": [],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_009",
    "language": "en-US",
    "theme": "Objects",
    "tier": "hard",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "H",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "Y",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "E",
        "type": "ice",
        "hp": 2
      },
      {
        "x": 3,
        "y": 3,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 5,
        "char": "L",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "K",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "FOX",
        "hint_text": "A wild canine",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "OWL",
        "hint_text": "A night bird",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "BEE",
        "hint_text": "A buzzing insect",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "COW",
        "hint_text": "A farm animal",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "CAT",
      "JAM"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "FOX",
        "path": [
          [
            4,
            1
          ],
          [
            4,
            2
          ],
          [
            4,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "OWL",
            "path": [
              [
                4,
                3
              ],
              [
                4,
                4
              ],
              [
                4,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "BEE",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": true,
        "triggers_gravity": false,
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w3",
        "text": "BEE",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "COW",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_010",
    "language": "en-US",
    "theme": "Objects",
    "tier": "hard",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "H",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "Z",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "B",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 3,
        "char": "Q",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "G",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "D",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "Y",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "T",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "E",
        "type": "lock",
        "lockKey": null,
        "locked": true
      },
      {
        "x": 4,
        "y": 5,
        "char": "P",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "M",
        "type": "normal"
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "FAN",
        "hint_text": "Moves air",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "HAT",
        "hint_text": "Worn on the head",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "BAG",
        "hint_text": "Carries things",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "JAM",
        "hint_text": "Fruit spread",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "POT",
      "RUG"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "FAN",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "HAT",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "BAG",
        "path": [
          [
            5,
            1
          ],
          [
            5,
            2
          ],
          [
            5,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "JAM",
            "path": [
              [
                5,
                3
              ],
              [
                5,
                4
              ],
              [
                5,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  },
  {
    "id": "wf_en_011",
    "language": "en-US",
    "theme": "Sky",
    "tier": "hard",
    "grid_dim": {
      "x": 6,
      "y": 6
    },
    "move_limit": null,
    "bonus_target": 3,
    "reward": {
      "coins": 100,
      "stars": 3
    },
    "initial_board": [
      {
        "x": 0,
        "y": 0,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 0,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 0,
        "char": "I",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 0,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 0,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 0,
        "char": "F",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 1,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 1,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 1,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 1,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 1,
        "char": "S",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 1,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 2,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 2,
        "char": "W",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 2,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 2,
        "char": "R",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 2,
        "char": "U",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 2,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 3,
        "char": "X",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 3,
        "char": "V",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 3,
        "char": "A",
        "type": "ice",
        "hp": 2
      },
      {
        "x": 3,
        "y": 3,
        "char": "A",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 3,
        "char": "N",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 3,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 4,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 4,
        "char": "H",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 4,
        "char": "C",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 4,
        "char": "J",
        "type": "normal"
      },
      {
        "x": 4,
        "y": 4,
        "char": "K",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 4,
        "char": "O",
        "type": "normal"
      },
      {
        "x": 0,
        "y": 5,
        "char": "H",
        "type": "normal"
      },
      {
        "x": 1,
        "y": 5,
        "char": "M",
        "type": "normal"
      },
      {
        "x": 2,
        "y": 5,
        "char": "E",
        "type": "normal"
      },
      {
        "x": 3,
        "y": 5,
        "char": "J",
        "type": "bomb",
        "countdown": 9
      },
      {
        "x": 4,
        "y": 5,
        "char": "Y",
        "type": "normal"
      },
      {
        "x": 5,
        "y": 5,
        "char": "L",
        "type": "lock",
        "lockKey": null,
        "locked": true
      }
    ],
    "target_words": [
      {
        "id": "w1",
        "text": "SUN",
        "hint_text": "The star we orbit",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w2",
        "text": "SKY",
        "hint_text": "The space above us",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w3",
        "text": "SEA",
        "hint_text": "The ocean",
        "default_path": null,
        "allow_reverse": true
      },
      {
        "id": "w4",
        "text": "ICE",
        "hint_text": "Frozen water",
        "default_path": null,
        "allow_reverse": true
      }
    ],
    "bonus_dictionary": [
      "FOX",
      "ARM"
    ],
    "solution_flow": [
      {
        "step": 1,
        "word_id": "w1",
        "text": "SUN",
        "path": [
          [
            4,
            1
          ],
          [
            4,
            2
          ],
          [
            4,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w2",
            "text": "SKY",
            "path": [
              [
                4,
                3
              ],
              [
                4,
                4
              ],
              [
                4,
                5
              ]
            ]
          }
        ],
        "combo": 0
      },
      {
        "step": 2,
        "word_id": "w3",
        "text": "SEA",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": true,
        "triggers_gravity": false,
        "combo": 0
      },
      {
        "step": 3,
        "word_id": "w3",
        "text": "SEA",
        "path": [
          [
            2,
            1
          ],
          [
            2,
            2
          ],
          [
            2,
            3
          ]
        ],
        "cracked": false,
        "triggers_gravity": false,
        "cascades": [
          {
            "word_id": "w4",
            "text": "ICE",
            "path": [
              [
                2,
                3
              ],
              [
                2,
                4
              ],
              [
                2,
                5
              ]
            ]
          }
        ],
        "combo": 0
      }
    ]
  }
]

export const LEVELS_BY_LANGUAGE = {
  'zh-CN': LEVELS.filter((l) => l.language === 'zh-CN'),
  'en-US': LEVELS.filter((l) => l.language === 'en-US'),
}

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) || null
}
