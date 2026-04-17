import sys

file_path = '/Users/atti/Developer/f#-01/Client.fs'

with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False

# 1. Update Neo module
for i, line in enumerate(lines):
    if 'module Neo =' in line:
        new_lines.append(line)
        # We start the replacement block for Neo components
        new_lines.append('        let Button (content: seq<Doc>) (accent: View<string>) (onClick: unit -> unit) =\n')
        new_lines.append('            button [\n')
        new_lines.append('                attr.classDyn (accent |> View.Map (fun a -> \n')
        new_lines.append('                    // Default: elevation 0 (flat), Hover: elevated (neo-flat)\n')
        new_lines.append('                    sprintf "neo-level-0 hover:neo-flat px-6 py-3 rounded-xl %s font-bold transition-all duration-300 active:scale-95 transform" a))\n')
        new_lines.append('                on.click (fun _ _ -> onClick())\n')
        new_lines.append('            ] content\n')
        new_lines.append('\n')
        new_lines.append('        let IconButton (icon: Doc) (accentHover: View<string>) (onClick: unit -> unit) =\n')
        new_lines.append('            button [\n')
        new_lines.append('                attr.classDyn (accentHover |> View.Map (fun ah -> \n')
        new_lines.append('                    // Default: flat, Hover: elevated\n')
        new_lines.append('                    sprintf "w-12 h-12 flex items-center justify-center rounded-full neo-level-0 hover:neo-flat text-gray-700 hover:%s transition-all duration-300 active:scale-95 transform" ah))\n')
        new_lines.append('                on.click (fun _ _ -> onClick())\n')
        new_lines.append('            ] [icon]\n')
        new_lines.append('\n')
        new_lines.append('        let Select<\'T when \'T : equality> (options: list<\'T>) (current: Var<\'T>) (toLabel: \'T -> string) (placeholder: string) (accent: View<string>) (accentHover: View<string>) (isRightAligned: bool) =\n')
        new_lines.append('            let isOpen = Var.Create false\n')
        new_lines.append('            div [attr.classDyn (View.Const (if isRightAligned then "relative" else "relative w-full"))] [\n')
        new_lines.append('                // Click-outside overlay\n')
        new_lines.append('                isOpen.View |> View.Map (fun openState ->\n')
        new_lines.append('                    if openState then \n')
        new_lines.append('                        div [attr.``class`` "fixed inset-0 z-[130]"; on.click (fun _ _ -> isOpen.Value <- false)] []\n')
        new_lines.append('                    else Doc.Empty\n')
        new_lines.append('                ) |> Doc.EmbedView\n')
        new_lines.append('                \n')
        new_lines.append('                button [\n')
        new_lines.append('                    attr.classDyn (accent |> View.Map (fun a -> sprintf "neo-flat px-6 py-4 rounded-2xl flex items-center justify-between space-x-3 %s font-bold transition-all duration-300 w-full" a))\n')
        new_lines.append('                    on.click (fun _ _ -> isOpen.Value <- not isOpen.Value)\n')
        new_lines.append('                ] [\n')
        new_lines.append('                    current.View |> View.Map (fun v -> \n')
        new_lines.append('                        let label = toLabel v\n')
        new_lines.append('                        if String.IsNullOrEmpty label || label = "0" then \n')
        new_lines.append('                            span [attr.``class`` "text-gray-400 font-medium"] [text placeholder]\n')
        new_lines.append('                        else text label\n')
        new_lines.append('                    ) |> Doc.EmbedView\n')
        new_lines.append('                    Doc.Verbatim """<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>"""\n')
        new_lines.append('                ]\n')
        new_lines.append('                isOpen.View |> View.Map (fun openState ->\n')
        new_lines.append('                    if openState then\n')
        new_lines.append('                        let alignClass = if isRightAligned then "right-0 w-48" else "left-0 right-0"\n')
        new_lines.append('                        div [attr.``class`` (sprintf "absolute top-full %s mt-4 neo-flat rounded-3xl p-3 z-[140] overflow-hidden animate-in fade-in zoom-in-95 duration-200" alignClass)] [\n')
        new_lines.append('                            options |> List.map (fun opt ->\n')
        new_lines.append('                                div [\n')
        new_lines.append('                                    attr.classDyn (accentHover |> View.Map (fun ah -> \n')
        new_lines.append('                                        let baseC = "p-4 hover:bg-white hover:bg-opacity-50 rounded-2xl cursor-pointer transition-all duration-200 font-bold text-gray-700 "\n')
        new_lines.append('                                        if current.Value = opt then baseC + "neo-pressed text-emerald-600 " + ah\n')
        new_lines.append('                                        else baseC + "hover:" + ah))\n')
        new_lines.append('                                    on.click (fun _ _ -> current.Value <- opt; isOpen.Value <- false)\n')
        new_lines.append('                                ] [text (toLabel opt)]\n')
        new_lines.append('                            ) |> Doc.Concat\n')
        new_lines.append('                        ]\n')
        new_lines.append('                    else Doc.Empty\n')
        new_lines.append('                ) |> Doc.EmbedView\n')
        new_lines.append('            ]\n')
        
        # Skip the original Neo component logic until Sidebar
        skip = True
        continue
    
    if skip:
        if 'let Sidebar' in line:
            skip = False
        else:
            continue
            
    new_lines.append(line)

with open(file_path, 'w') as f:
    f.writelines(new_lines)

print("Neo components updated successfully.")
