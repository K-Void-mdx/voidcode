def show_plan(plan):

    print("\n🧠 PLAN GENERATED\n")

    print(f"Goal: {plan['goal']}\n")

    for i, step in enumerate(plan["steps"], 1):
        print(f"{i}. {step}")

    print("\n----------------------\n")
